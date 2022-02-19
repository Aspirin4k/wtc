BINARY_DIRECTORY=./target
BINARY_NAME=wtc

# AWS CodeBuild has no git metadata
ifndef CODEBUILD_RESOLVED_SOURCE_VERSION
BINARY_VERSION = $(shell git log --format="%H" -n 1)
else
BINARY_VERSION = ${CODEBUILD_RESOLVED_SOURCE_VERSION}
endif

GO_LDFLAGS = "-X 'whentheycry.ru/m/v2/web.BuildVersion=$(BINARY_VERSION)'"

build-post-update:
	go build -ldflags ${GO_LDFLAGS} -o ${BINARY_DIRECTORY}/${BINARY_NAME}-post-update ./cmd/post-update/post-update.go

build-post-loader:
	go build -ldflags ${GO_LDFLAGS} -o ${BINARY_DIRECTORY}/${BINARY_NAME}-post-loader ./cmd/post-loader/post-loader.go

build-server:
	go build -ldflags ${GO_LDFLAGS} -o ${BINARY_DIRECTORY}/${BINARY_NAME}-server ./cmd/server/server.go

build: build-post-loader build-server

clean:
	go clean
	rm -rf ${BINARY_DIRECTORY}