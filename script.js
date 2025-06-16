console.log('Lets start javaScript');
let currentSong = new Audio()

function secondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor( seconds % 60);

  // Pad single-digit seconds with leading zero
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  // Pad single-digit minutes with leading zero
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const totalSeconds = 72;
const formattedTime = secondsToMinutesAndSeconds(totalSeconds);
console.log(formattedTime); // Output: "01:12"

async function getSongs() {

  let a = await fetch("http://127.0.0.1:5500/songs/")
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  let songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith('.mp3')) {
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs
}
const playMusic = (track, pause=false) => {
  // let audio= new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track
  if(!pause){
    currentSong.play()
    play.src = "assets/pause2.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function main() {
  // Get the list of all the songs
  let songs = await getSongs()
  playMusic(songs[0], true)
  // console.log(songs)
  // show all the songs in a playlist
  let songUl = document.querySelector(".songLibrary").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + ` 
        <li>
              <div class="music">
                <img class="invert" src="assets/music.svg" alt="music">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Unknown</div>
                </div>
              </div>
              <div class="playnow">
                <span>Play Now!</span>
                <img src="play.svg" alt="">
              </div>
            </li>`
  }
  // attach an event listener to each song 
  Array.from(document.querySelector(".songLibrary").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })
  })
  // attach an event for play/pause , next and prev
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "assets/pause2.svg"

    }
    else {
      currentSong.pause()
      play.src = "play.svg"
    }
  })
  // Add this code to log errors to the console
  play.addEventListener("error", (event) => {
    console.error("Error loading image:", event);
  });

  // listen to time update
  currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesAndSeconds(currentSong.currentTime)}:${secondsToMinutesAndSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + '%'
  })
  // add an eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)*percent )/100
  })

}
main()