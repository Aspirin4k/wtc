BINARY_DIRECTORY=./target
BINARY_NAME=wtc

build-post-loader:
	go build -o ${BINARY_DIRECTORY}/${BINARY_NAME}-post-loader ./cmd/post-loader/post-loader.go

build-server:
	go build -o ${BINARY_DIRECTORY}/${BINARY_NAME}-server ./cmd/server/server.go

build: build-post-loader build-server

clean:
	go clean
	rm -rf ${BINARY_DIRECTORY}