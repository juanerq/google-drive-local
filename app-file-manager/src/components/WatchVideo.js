const WatchVideo = () => {
  return (
      <>
      <video controls autoplay width="1080">
          <source src="http://192.168.1.5:8080/watch/files?v=video.mp4" type="video/mp4" />
      </video>
      </>
  )
}