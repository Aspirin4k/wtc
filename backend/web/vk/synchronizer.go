package vk

import (
	"database/sql"
	"sort"

	"whentheycry.ru/m/v2/web/entity"
	"whentheycry.ru/m/v2/web/storage"
)

const (
	batchSize = 20
)

type Synchronizer struct {
	db *sql.DB

	client      *Client
	transformer *Transformer

	communityStorage *storage.Community
	postStorage      *storage.Post
	photoStorage     *storage.Photo
}

func NewSynchronizer(
	db *sql.DB,
	client *Client,
	transformer *Transformer,
	communityStorage *storage.Community,
	postStorage *storage.Post,
	photoStorage *storage.Photo) *Synchronizer {
	return &Synchronizer{
		db: db,

		client:      client,
		transformer: transformer,

		communityStorage: communityStorage,
		postStorage:      postStorage,
		photoStorage:     photoStorage,
	}
}

func (s *Synchronizer) SyncAllPosts() error {
	tr, err := s.db.Begin()
	if err != nil {
		return err
	}

	err = s.postStorage.Clear(tr)
	if err != nil {
		tr.Rollback()
		return err
	}

	err = s.photoStorage.Clear(tr)
	if err != nil {
		tr.Rollback()
		return err
	}

	err = s.SyncNewPosts(tr)
	if err != nil {
		tr.Rollback()
		return err
	}

	return tr.Commit()
}

func (s *Synchronizer) SyncNewPosts(tr *sql.Tx) error {
	communityIds, err := s.communityStorage.GetCommunities(tr)
	if err != nil {
		return err
	}

	for _, communityId := range communityIds {
		lastPost, err := s.postStorage.GetLastPost(communityId, tr)
		if err != nil {
			return err
		}

		offset := 0
		hasNewPosts := true
		for hasNewPosts {
			posts, err := s.client.GetLastPosts(communityId, offset, batchSize)
			if err != nil {
				return err
			}

			if len(posts.Response.Items) == 0 {
				break
			}

			hasNewPosts, err = s.savePosts(posts.Response.Items, lastPost, communityId, tr)
			if err != nil {
				return err
			}

			offset += batchSize
		}
	}

	return nil
}

func (s *Synchronizer) savePosts(vkPosts []*Post, lastPost *entity.Post, communityId int, tr *sql.Tx) (bool, error) {
	dbPosts := make([]*entity.Post, 0, len(vkPosts))

	sort.Slice(vkPosts, func(i int, j int) bool {
		return vkPosts[i].Date > vkPosts[j].Date
	})

	isNewPostsLeft := true
	for _, vkPost := range vkPosts {
		if nil != lastPost && vkPost.ID == lastPost.ID {
			isNewPostsLeft = false
			break
		}

		if vkPost.OwnerID == -communityId && nil == vkPost.CopyHistory {
			dbPosts = append(dbPosts, s.transformer.TransformPost(vkPost))
		}
	}

	err := s.postStorage.Save(dbPosts, tr)
	return isNewPostsLeft, err
}
