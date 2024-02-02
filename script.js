





// fetching of songs from local api http://127.0.0.1:3000/songs
// global variable of current song

let currentSong = new Audio();
let songs;
let currentFolder;
let play = document.getElementById("playSong");
let cardSection = document.querySelector(".card-section")
// functio of formatting seconds into minutes
function formatTime(seconds) {
  // Calculate minutes, and remaining seconds
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if needed
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  // Combine the formatted values into the desired format
  const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
}





async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:3002/songs/${currentFolder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp4")) {
      songs.push(element.href.split(`/${currentFolder}/`)[1])
    }
  }

  // display songs name inside songs-playlist 
  let songPlaylistUl = document.querySelector(".songs-playlist").getElementsByTagName('ul')[0];
  songPlaylistUl.innerHTML = ''
  for (const song of songs) {
    songPlaylistUl.innerHTML = songPlaylistUl.innerHTML + `
    <li>
                 <img class="invert" src="images/music.svg" alt="">
                 <div class="song-info">
  
                  <div class="song-name">${decodeURI(song)}</div>
                  <div class="writer-name">S Khan</div>
                 </div>
                 <div class="play-now">
                      <span class="span">Play Now</span>
                      <img class="c-pointer" src="images/play.svg" alt="">
                 </div>
              </li>
     
    `
  }

  // Attach an event listener to each song
  Array.from(document.querySelector(".songs-playlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".song-name").innerHTML);

      playMusic(e.querySelector(".song-name").innerHTML);


    })
  });

}
function playMusic(track, pause = false) {
  currentSong.src = `songs/${currentFolder}/` + (track)
  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg"
  }
  //  display song name in playbar
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.getElementById("songtime").innerHTML = "00:00 / 00:00"

}
// Display Album Function
async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3002/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  console.log(div);
  let anchors = div.getElementsByTagName('a');
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = (e.href.split('/').slice("-2")[0]);
      //  Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:3002/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response)
      cardSection.innerHTML = cardSection.innerHTML + `
    
    <div data-folder=${folder} class="playlist-card">
      <div class="img-section">
        <div class="circular-button">
        <img src="images/play2.svg" alt="">
         
        </div>
        <img class="main-img" src="/songs/${folder}/cover.jpeg" alt="" />
      </div>
      <div class="text-section">
        <h3 class="text-white">${response.title}</h3>
        <p class="para text-grey">${response.description}</p>
      </div>
    </div>
  
    `
    }

  }

  //  Load the playlist when the card is clicked
  Array.from(document.getElementsByClassName('playlist-card')).forEach(e => {
    console.log(e);
    e.addEventListener("click", async item => {
      console.log(item, item.currentTarget.dataset)
      songs = await getSongs(`${item.currentTarget.dataset.folder}`);

    })
   
  })



}


// call main function
async function main() {
  // get the list of songs
  await getSongs('old');
  playMusic(songs[0], true)

  // display all the albums on screen
  displayAlbums();

  // event listener on play-song for playing or pauusing audio

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg"
    }
    else {
      currentSong.pause();
      play.src = "images/play.svg"

    }
  })

  // Listen for current time and duration of current song
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration)
    document.getElementById("songtime").innerHTML = `
           ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}
           `;
    document.getElementsByClassName('circle')[0].style.left = ((currentSong.currentTime) / (currentSong.duration)) * 100 + "%"
  })

  // Add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener('click', (e) => {
    let percent = ((e.offsetX) / (e.target.getBoundingClientRect().width)) * 100;
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration) * (percent)) / 100;
  })

  //  Add an event listener to previous and next button on playbar
  let previous = document.getElementById('prev-song');
  let next = document.getElementById('next-song');
  previous.addEventListener('click', (e) => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
    else {
      playMusic(songs[songs.length - 1])
    }

  })
  next.addEventListener('click', () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
    else {
      playMusic(songs[0])
    }
  })



}
main();

// hamburger listener

let left = document.querySelector('.left-container');
let hamburger = document.querySelector('.hamburger');
let cross = document.querySelector('.cross');
document.querySelector(".hamburger").addEventListener('click', () => {
  left.style.left = "0"
  left.style.width = "350px"
  cross.style.display = "block"
  cross.addEventListener('click', () => {
    left.style.left = "-120%"
  })


})