document.addEventListener("DOMContentLoaded", () => {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const PLAYER_STORAGE_KEY = "F8_PLAYER";

    const player = $('.player')
    const cd = $('.cd');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb');
    const audio = $('#audio');
    const playBtn = $('.btn-toggle-play');
    const progress = $('#progress');
    const prevBtn = $('.btn-prev');
    const nextBtn = $('.btn-next');
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');
    const playlist = $('.playlist');

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        setConfig: function(key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));  
        },
        songs: [
            {
            name: "Unbecoming",
            singer: "Starset",
            path: "https://data3.chiasenhac.com/downloads/2114/1/2113613-fb1484c3/128/Unbecoming%20-%20Starset.mp3",
            image: "https://data.chiasenhac.com/data/cover/127/126675.jpg",
            },
            {
            name: "Awake And Alive",
            singer: "Skillet",
            path: "https://data55.chiasenhac.com/downloads/1145/1/1144123-93b04f14/128/Awake%20And%20Alive%20-%20Skillet.mp3",
            image:"https://data.chiasenhac.com/data/cover/11/10238.jpg"
            },
            {
            name: "Ever Dream",
            singer: "Nightwish",
            path:"https://data53.chiasenhac.com/downloads/1066/1/1065065-ce09d4cd/128/Ever%20Dream%20-%20Nightwish.mp3",
            image: "https://data.chiasenhac.com/data/cover/5/4276.jpg"
            },
            {
            name: "Bury The Light",
            singer: "Casey Edwards, Victor Borba",
            path:"https://data16.chiasenhac.com/downloads/2146/1/2145241-b29e0d24/128/Bury%20the%20Light%20-%20Casey%20Edwards_%20Victor%20B.mp3",
            image: "https://data.chiasenhac.com/data/cover/134/133899.jpg"
            },
            {
            name: "My Demons",
            singer: "Starset",
            path:"https://data2.chiasenhac.com/stream2/1611/1/1610059-b2fb0a63/128/My%20Demons%20-%20Starset.mp3",
            image: "https://data.chiasenhac.com/data/cover/52/51527.jpg"
            },
            {
            name: "Unbecoming 2",
            singer: "Starset 2",
            path: "https://data3.chiasenhac.com/downloads/2114/1/2113613-fb1484c3/128/Unbecoming%20-%20Starset.mp3",
            image: "https://data.chiasenhac.com/data/cover/127/126675.jpg",
            },
            {
            name: "Awake And Alive 2",
            singer: "Skillet 2",
            path: "https://data55.chiasenhac.com/downloads/1145/1/1144123-93b04f14/128/Awake%20And%20Alive%20-%20Skillet.mp3",
            image:"https://data.chiasenhac.com/data/cover/11/10238.jpg"
            },
            {
            name: "Ever Dream 2",
            singer: "Nightwish 2",
            path:"https://data53.chiasenhac.com/downloads/1066/1/1065065-ce09d4cd/128/Ever%20Dream%20-%20Nightwish.mp3",
            image: "https://data.chiasenhac.com/data/cover/5/4276.jpg"
            },
            {
            name: "Bury The Light 2",
            singer: "Casey Edwards, Victor Borba 2",
            path:"https://data16.chiasenhac.com/downloads/2146/1/2145241-b29e0d24/128/Bury%20the%20Light%20-%20Casey%20Edwards_%20Victor%20B.mp3",
            image: "https://data.chiasenhac.com/data/cover/134/133899.jpg"
            },
            {
            name: "My Demons 2",
            singer: "Starset 2",
            path:"https://data2.chiasenhac.com/stream2/1611/1/1610059-b2fb0a63/128/My%20Demons%20-%20Starset.mp3",
            image: "https://data.chiasenhac.com/data/cover/52/51527.jpg"
            },
            
        ],
        // Render HTML
        render: function() {
            const htmls = this.songs.map((song, index) => {
                return `
                        <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                            <div class="thumb" style="background-image: url('${song.image}')">
                            </div>

                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>

                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
            });
            playlist.innerHTML = htmls.join('\n');
        },
        // Define new properties of app object
        defineProperties: function() {
            Object.defineProperty(this, "currentSong", {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            })
        },
        // Handling all events
        handleEvents: function() {
            const cdWidth = cd.offsetWidth;

            // Rotating cd
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg'}
            ], {
                duration: 10000, 
                iterations: Infinity
            });
            cdThumbAnimate.pause();

            document.onscroll = function() {
                const scrollTop = window.screenY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop;
                
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth;
            }

            //Click the Play button
            playBtn.onclick = () => {
                if (this.isPlaying)    
                    audio.pause();           
                else 
                    audio.play();   
            }
            // When song is playing
            audio.onplay = () => {
                this.isPlaying = true; 
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            // When song is pausing
            audio.onpause = () => {
                this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }
            // Update progress bar
            setInterval(() => {
                audio.ontimeupdate = () => {
                    if (audio.duration) {
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                        progress.value = progressPercent;
                    }
                }
            }, 1000);
            // Change current song's playing time
            progress.onchange = (e) => {
                
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;   
            }
            // Press prev button
            prevBtn.onclick = () => {
                if (this.isRandom) {
                    this.playRandomSong();
                }
                else {
                    if (this.isPlaying)
                        audio.pause();
                    this.prevSong();
                }
                audio.play();
                this.render();
                this.scrollToActiveSong();
            }

            // Press next button
            nextBtn.onclick = () => {
                if (this.isRandom) {
                    this.playRandomSong();
                }
                else {
                    if (this.isPlaying)
                        audio.pause();
                    this.nextSong();
                }
                audio.play();
                this.render();
                this.scrollToActiveSong();
            }

            // Press random button
            randomBtn.onclick = () => {
                this.isRandom = !this.isRandom;
                this.setConfig('isRandom', this.isRandom);
                randomBtn.classList.toggle('active', this.isRandom);
            }

            // Press repeat button
            repeatBtn.onclick = () => {
                this.isRepeat = !this.isRepeat;
                this.setConfig('isRepeat', this.isRepeat);
                repeatBtn.classList.toggle('active', this.isRepeat);
            
            },

            // Audio ended
            audio.onended = () => {
                if (this.isRepeat) {
                    playBtn.click();
                }
                else
                    nextBtn.click();
            }

            // Click playlist
            playlist.onclick = (e) => {
                const songNode = e.target.closest('.song:not(.active)');
                if ((songNode) && !(e.target.closest('.option'))) {
                        this.currentIndex = Number(songNode.dataset.index);
                        this.loadCurrentSong();
                        audio.play();
                        this.render();
                        console.log(this.currentIndex);
                    }
            }
        },
        // Load infos of the current song
        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
        },
        // Load config in local storage
        loadConfig: function() {
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
            
            randomBtn.classList.toggle('active', this.isRandom);
            repeatBtn.classList.toggle('active', this.isRepeat);
        },
        // Locate previous song
        prevSong: function() {
            if (this.currentIndex == 0) 
                this.currentIndex = this.songs.length - 1;
            else 
                this.currentIndex--;
            this.loadCurrentSong();
        },
        // Locate next song
        nextSong: function() {
            if (this.currentIndex == this.songs.length - 1) 
                this.currentIndex = 0;
            else 
                this.currentIndex++;
            this.loadCurrentSong();
        },
        // Set random song
        playRandomSong: function() {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            } while (newIndex === this.currentIndex)
            this.currentIndex = newIndex;
            this.loadCurrentSong();
        },

        // Scroll the selected song in playlist
        scrollToActiveSong: function() {
            let behavior = 'smooth';
            let block = 'nearest';

            setTimeout(() => {        
                if (this.currentIndex === 0)
                    block = 'end';        
                $('.song.active').scrollIntoView({
                    behavior: behavior,
                    block: block,
                });
                
            }, 300);
        },

        start: function() {
            this.loadConfig();
            this.defineProperties();
            this.handleEvents();
            this.loadCurrentSong();
            this.render();
        }
    }

    app.start();
})


/*
BUGS:
    Progress bar is hard to press
*/