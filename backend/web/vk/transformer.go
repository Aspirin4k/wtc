package vk

import (
	"whentheycry.ru/m/v2/web/entity"
	"whentheycry.ru/m/v2/web/image"
	"whentheycry.ru/m/v2/web/utils"
)

type Transformer struct {
	imageLoader *image.Loader
}

func NewTransformer(imageLoader *image.Loader) *Transformer {
	return &Transformer{
		imageLoader: imageLoader,
	}
}

func (t *Transformer) TransformPost(vkPost *Post) *entity.Post {
	var post entity.Post
	post.ID = vkPost.ID
	post.Content = utils.StringEscape(vkPost.Text)
	post.Title = utils.StringCutByWords(post.Content, entity.TitleLength)
	post.CommunityID = -vkPost.OwnerID
	post.DatePublished = vkPost.Date

	if nil != vkPost.Attachments {
		post.Photos = make([]*entity.Photo, 0, len(vkPost.Attachments))
		for _, vkAttachment := range vkPost.Attachments {
			photo := t.TransformPhoto(vkAttachment, vkPost.ID)
			if nil != photo {
				post.Photos = append(post.Photos, photo)
			}
		}
	}

	return &post
}

func (t *Transformer) TransformPhoto(vkAttachment *Attachment, postID int) *entity.Photo {
	if vkAttachment.Type != AttachmentTypePhoto {
		return nil
	}

	var photo entity.Photo
	photo.ID = vkAttachment.Photo.ID
	photo.PostID = postID
	for _, vkPhotoSize := range vkAttachment.Photo.Sizes {
		switch vkPhotoSize.Type {
		case "x":
			photo.UrlMedium = &vkPhotoSize.URL
		case "s":
			photo.UrlSmall = &vkPhotoSize.URL
		case "z":
			photo.UrlLarge = &vkPhotoSize.URL
		}
	}

	for _, url := range []*string{photo.UrlSmall, photo.UrlMedium, photo.UrlLarge} {
		if nil == url {
			continue
		}

		img, err := t.imageLoader.GetImage(*url)
		if err == nil {
			photo.IsHorizontal = img.Bounds().Dx() > img.Bounds().Dy()
		}

		break
	}

	return &photo
}
