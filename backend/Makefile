BINARY_DIRECTORY=./target
BINARY_NAME=wtc

build-post-loader:
	go build -o ${BINARY_DIRECTORY}/${BINARY_NAME}-post-loader ./cmd/post-loader/post-loader.go

build: build-post-loader

clean:
	go clean
	rm -rf ${BINARY_DIRECTORY}