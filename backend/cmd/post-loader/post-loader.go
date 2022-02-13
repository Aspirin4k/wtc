package main

import (
	"database/sql"
	"sort"
	"time"

	"whentheycry.ru/m/v2/web/entity"
	"whentheycry.ru/m/v2/web/storage"

	_ "github.com/go-sql-driver/mysql"

	"whentheycry.ru/m/v2/web/utils"
	"whentheycry.ru/m/v2/web/vk"
)

const (
	batchSize = 20
)

func main() {
	utils.FlagInit()
	utils.FlagParse()

	vkUrl := utils.GetEnv("VK_API_URL", "https://api.vk.com")
	vkVersion := utils.GetEnv("VK_API_VERSION", "5.81")
	vkToken := utils.GetEnv("VK_API_TOKEN", "")
	vkClient := vk.New(vkUrl, vkToken, vkVersion)

	dbUrl := utils.GetEnv("MYSQL_DATABASE_URL", "tcp(127.0.0.1:3306)/posts")
	dbUser := utils.GetEnv("MYSQL_DATABASE_USER", "root")
	dbPassword := utils.GetEnv("MYSQL_DATABASE_PASSWORD", "root")
	db, err := sql.Open("mysql", dbUser+":"+dbPassword+"@"+dbUrl)
	if err != nil {
		panic(err)
	}

	db.SetConnMaxLifetime(time.Minute)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	communityStorage := storage.NewCommunityStorage(db)
	communityIds, err := communityStorage.GetCommunities()
	if err != nil {
		panic(err)
	}

	photoStorage := storage.NewPhotoStorage(db)
	postStorage := storage.NewPostStorage(db, photoStorage)
	for _, communityId := range communityIds {
		lastPost, err := postStorage.GetLastPost(communityId)
		if err != nil {
			panic(err)
		}

		offset := 0
		hasNewPosts := true
		for hasNewPosts {
			posts, err := vkClient.GetLastPosts(communityId, offset, batchSize)
			if err != nil {
				panic(err)
			}

			if posts.Response.Count == 0 {
				break
			}

			hasNewPosts, err = savePosts(postStorage, posts.Response.Items, lastPost, communityId)
			if err != nil {
				panic(err)
			}

			offset += batchSize
		}
	}
}

func savePosts(postStorage *storage.Post, vkPosts []*vk.Post, lastPost *entity.Post, communityId int) (bool, error) {
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
			dbPosts = append(dbPosts, transformPost(vkPost, communityId))
		}
	}

	err := postStorage.Save(dbPosts)
	return isNewPostsLeft, err
}

func transformPost(vkPost *vk.Post, communityId int) *entity.Post {
	var post entity.Post
	post.ID = vkPost.ID
	post.Content = utils.StringEscape(vkPost.Text)
	post.Title = utils.StringCutByWords(post.Content, entity.TitleLength)
	post.CommunityID = communityId
	post.DatePublished = vkPost.Date

	if nil != vkPost.Attachments {
		post.Photos = make([]*entity.Photo, 0, len(vkPost.Attachments))
		for _, vkAttachment := range vkPost.Attachments {
			photo := transformPhoto(vkAttachment, vkPost.ID)
			if nil != photo {
				post.Photos = append(post.Photos, photo)
			}
		}
	}

	return &post
}

func transformPhoto(vkAttachment *vk.Attachment, postId int) *entity.Photo {
	if vkAttachment.Type != vk.AttachmentTypePhoto {
		return nil
	}

	var photo entity.Photo
	photo.ID = vkAttachment.Photo.ID
	photo.PostID = postId
	for _, vkPhotoSize := range vkAttachment.Photo.Sizes {
		switch vkPhotoSize.Type {
		case "x":
			photo.UrlMedium = vkPhotoSize.URL
		case "s":
			photo.UrlSmall = vkPhotoSize.URL
		case "z":
			photo.UrlLarge = vkPhotoSize.URL
		}
	}
	return &photo
}
