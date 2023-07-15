/**
 * 1. render song
 * 2. scroll top
 * 3. play.pause/seek 
 * 4. CD rotate
 * 5. next/prev
 * 6. random
 * 7. next/repeat when ended
 * 8. active song
 * 9. scroll active song into view
 * 10. play song when click
 */


const $=document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY='F8_PLAYER'

const player=$('.player')
const cd=$('.cd');
const heading=$('header h2')
const cdThumb=$('.cd-thumb')
const audio=$('#audio')
const playBtn=$('.btn-toggle-play')
const progress=$('#progress')
const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')
const playList=$('.playlist')



const app={
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs:[
        {
            name:"Nevada",
            singer:"Vicetone",
            path: "./assets/music/song1.mp3",
            image:"https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name:"SummerTime",
            singer:"K=391",
            path: "./assets/music/song2.mp3",
            image:"https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name:"Monody",
            singer:"TheFatRat",
            path: "./assets/music/song3.mp3",
            image:"https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name:"Reality",
            singer:"Lost Frequencies",
            path: "./assets/music/song4.mp3",
            image:"https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name:"Ngay khac la",
            singer:"Giang Pham",
            path: "./assets/music/song5.mp3",
            image:"https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name:"Lemon tree",
            singer:"Desa Meric",
            path: "./assets/music/song6.mp3",
            image:"https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name:"Sugar",
            singer:"Maroon 5",
            path: "./assets/music/song7.mp3",
            image:"https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name:"My love",
            singer:"Westlite",
            path: "./assets/music/song8.mp3",
            image:"https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name:"Attention",
            singer:"Chartie Puth",
            path: "./assets/music/song9.mp3",
            image:"https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name:"Monster",
            singer:"Katie sky",
            path: "./assets/music/song10.mp3",
            image:"https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
    ],

    //
    setConfig: function(key, value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    //render ra ds nhac
    render:function(){
        const htmls=this.songs.map((song, index)=>{
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}"> 
                    <div class="thumb" style="background-image:url('${song.image}') ;"></div>
                
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML=htmls.join('');
    },


    //định nghĩa các thuộc tính
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            //lấy ra bài hát hiện tại
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    //xu ly su kien
    handleEvents:function(){
        const _this=this;
        const cdWidth=cd.offsetWidth //lấy ra width của .cd
        //cuộn chuot ẩn cd
        document.onscroll=function(){
            const scrollTop=window.scrollY || document.documentElement.scrollTop;
            const newCdWidth=cdWidth-scrollTop
            cd.style.width=newCdWidth >0 ? newCdWidth + 'px' : 0
            cd.style.opacity=newCdWidth/cdWidth
        }

        //xử lý cd quay, dừng
        const cdThumbAnimate= cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity //quay vô hạn
        })
        cdThumbAnimate.pause()

        //Xử lý khi click play
        playBtn.onclick=function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        //khi song dc play
        audio.onplay=function(){
            _this.isPlaying=true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi song bi pause
        audio.onpause=function(){
            _this.isPlaying=false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi thì thanh range chạy
        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent=Math.floor(audio.currentTime / audio.duration *100)
                progress.value=progressPercent // % bài hát (0->1)
            }
        }
        //xử lý khi tua song
        progress.onchange=function(e){
            //lấy ra % bài hát progress.value or e.target.value
            //lấy ra thời gian hiện tại của song:
            const seekTime=e.target.value /100 * audio.duration
            audio.currentTime=seekTime
        }

        //khi next song
        nextBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //khi prev song
        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý bật tắt random song
        randomBtn.onclick=function(){
            _this.isRandom=!_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        
        //xử lý phát lại 1 bài hát
        repeatBtn.onclick=function(e){
            _this.isRepeat=!_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //xử lý next song khi audio ended
        audio.onended=function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //lắng nghe hành vi click vào playList
        playList.onclick=function(e){
            const songNode=e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //xử lí khi click vào song
                if(songNode){
                    _this.currentIndex=Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //xử lý khi click vào option
                if(e.target.closest('.option')){

                }
            }
        }

    },

    //tải thông tin bài hát khi chạy 
    loadCurrentSong:function(){
        heading.textContent=this.currentSong.name
        cdThumb.style.backgroundImage=`url(${this.currentSong.image})`
        audio.src=this.currentSong.path
    },

    //load config 
    loadConfig: function(){
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat
    },

    //next song
    nextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    //prev song
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    //random bai hat
    playRandomSong:function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex===this.currentIndex) //lặp lại nếu random trùng với bài cũ
        this.currentIndex=newIndex
        this.loadCurrentSong()
    },

    //
    scrollToActiveSong:function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: "center"
            })
        }, 300)
    },
  
    //ham chay
    start:function(){
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        this.defineProperties()
        this.handleEvents();

        this.loadCurrentSong()
        this.render();

        //hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start();

 