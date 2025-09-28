package web

import (
	"database/sql"

	"whentheycry.ru/m/v2/web/controller"
	"whentheycry.ru/m/v2/web/database"
	"whentheycry.ru/m/v2/web/image"
	"whentheycry.ru/m/v2/web/storage"
	"whentheycry.ru/m/v2/web/utils"
	"whentheycry.ru/m/v2/web/vk"
	"whentheycry.ru/m/v2/web/xsolla"
)

type ServiceLocator struct {
	db *sql.DB

	postController *controller.PostController

	communityStorage *storage.Community
	postStorage      *storage.Post
	photoStorage     *storage.Photo

	imageLoader *image.Loader

	vkSynchronizer *vk.Synchronizer
	vkClient       *vk.Client
	vkTransformer  *vk.Transformer

	xsollaClient *xsolla.Client
}

func NewServiceLocator() *ServiceLocator {
	return &ServiceLocator{}
}

func (s *ServiceLocator) GetDB() (*sql.DB, error) {
	if nil == s.db {
		var err error
		s.db, err = database.NewDB()
		if err != nil {
			return nil, err
		}
	}

	return s.db, nil
}

func (s *ServiceLocator) GetCommunityStorage() (*storage.Community, error) {
	if nil == s.communityStorage {
		db, err := s.GetDB()
		if err != nil {
			return nil, err
		}

		s.communityStorage = storage.NewCommunityStorage(db)
	}

	return s.communityStorage, nil
}

func (s *ServiceLocator) GetPostStorage() (*storage.Post, error) {
	if nil == s.postStorage {
		db, err := s.GetDB()
		if err != nil {
			return nil, err
		}

		photoStorage, err := s.GetPhotoStorage()
		if err != nil {
			return nil, err
		}

		s.postStorage = storage.NewPostStorage(db, photoStorage)
	}

	return s.postStorage, nil
}

func (s *ServiceLocator) GetPhotoStorage() (*storage.Photo, error) {
	if nil == s.photoStorage {
		db, err := s.GetDB()
		if err != nil {
			return nil, err
		}

		s.photoStorage = storage.NewPhotoStorage(db)
	}

	return s.photoStorage, nil
}

func (s *ServiceLocator) GetImageLoader() *image.Loader {
	if nil == s.imageLoader {
		s.imageLoader = image.NewLoader()
	}

	return s.imageLoader
}

func (s *ServiceLocator) GetVKTransformer() *vk.Transformer {
	if nil == s.vkTransformer {
		s.vkTransformer = vk.NewTransformer(s.GetImageLoader())
	}

	return s.vkTransformer
}

func (s *ServiceLocator) GetVKClient() *vk.Client {
	if nil == s.vkClient {
		vkUrl := utils.GetEnv("VK_API_URL", "https://api.vk.ru")
		vkVersion := utils.GetEnv("VK_API_VERSION", "5.81")
		vkToken := utils.GetEnv("VK_API_TOKEN", "")
		s.vkClient = vk.New(vkUrl, vkToken, vkVersion)
	}

	return s.vkClient
}

func (s *ServiceLocator) GetVKSynchronizer() (*vk.Synchronizer, error) {
	if nil == s.vkSynchronizer {
		db, err := s.GetDB()
		if err != nil {
			return nil, err
		}

		communityStorage, err := s.GetCommunityStorage()
		if err != nil {
			return nil, err
		}

		postStorage, err := s.GetPostStorage()
		if err != nil {
			return nil, err
		}

		photoStorage, err := s.GetPhotoStorage()
		if err != nil {
			return nil, err
		}

		s.vkSynchronizer = vk.NewSynchronizer(
			db,
			s.GetVKClient(),
			s.GetVKTransformer(),
			communityStorage,
			postStorage,
			photoStorage,
		)
	}

	return s.vkSynchronizer, nil
}

func (s *ServiceLocator) GetPostController() (*controller.PostController, error) {
	if s.postController == nil {
		postStorage, err := s.GetPostStorage()
		if err != nil {
			return nil, err
		}

		s.postController = controller.NewPostController(postStorage)
	}

	return s.postController, nil
}

func (s *ServiceLocator) GetXsollaClient() *xsolla.Client {
	if s.xsollaClient == nil {
		s.xsollaClient = xsolla.New(
			utils.GetEnv("XSOLLA_LOGIN_API", "https://login.xsolla.com/api"),
			utils.GetIntEnv("XSOLLA_LOGIN_CLIENT_ID", 4790),
			utils.GetEnv("XSOLLA_LOGIN_SECRET", ""),
			utils.GetIntEnv("XSOLLA_PUBLISHER_ID", 266596),
			utils.GetIntEnv("XSOLLA_PUBLISHER_PROJECT_ID", 186513),
		)
	}

	return s.xsollaClient
}
