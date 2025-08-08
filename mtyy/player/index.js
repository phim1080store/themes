function getNextPrevEpisode(isNext) {
    let episodes = episodeList.filter((value, index, self) => index === self.findIndex((e) => e.slug === value.slug && e.server === value.server && e.movie_id === value.movie_id))
    let index = episodes.findIndex((e) => e.slug === currentSlug)
    if (index === -1) return null

    let newIndex = isNext ? index + 1 : index - 1
    if (!episodes[newIndex]) return null
    let url = window.location.href

    return url.substring(0, url.lastIndexOf('/')) + `/${episodes[newIndex].slug}-${episodes[newIndex].id}`
}

function getAudioUrl(type = 'single') {
    if (type === 'single') {
        let href = document.querySelector('.player-list-box a.choose')?.getAttribute('href')
        let slug = href?.replace(/-\d+$/, '-')
        let movie_id = href?.split('/').filter(Boolean).pop().match(/\d+$/)?.[0]

        let allLinks = Array.from(document.querySelectorAll('a[id^="episode-"]'))
        let filteredLinks = allLinks.filter((a) => {
            let dataId = a.getAttribute('href')
            return dataId?.startsWith(slug)
        })

        let activeEpisodeDiv = document.querySelector('.player-list-box a.choose')
        let activeEpisodeId = activeEpisodeDiv?.id.replace('episode-', '') || ''
        let activeDataIdText = document.querySelector(`#episode-${activeEpisodeId} .server-name`)?.textContent.trim() || ''

        let selectorFromServer = filteredLinks.map((a, index) => {
            let episodeId = a?.id.replace('episode-', '') || ''
            let dataIdText = document.querySelector(`#episode-${episodeId} .server-name`)?.textContent.trim() || ''

            return {
                html: dataIdText == 'Vietsub' ? 'Tiếng gốc' : dataIdText,
                value: index,
                href: a.href,
                default: a.href === href,
            }
        })

        return { movie_id, activeDataIdText, selectorFromServer }
    }
    let activeLink = document.querySelector('li.on > .info > a')
    let href = activeLink?.getAttribute('href')
    let slug = href?.replace(/-\d+$/, '-')
    let movie_id = href?.split('/').filter(Boolean).pop().match(/\d+$/)?.[0]

    let allLinks = Array.from(document.querySelectorAll('[id^="episode-"] .info > a'))
    let filteredLinks = allLinks.filter((a) => {
        let dataId = a.getAttribute('href')
        return dataId?.startsWith(slug)
    })

    let activeEpisodeDiv = activeLink?.closest('div[id^="episode-"]')
    let activeEpisodeId = activeEpisodeDiv?.id.replace('episode-', '') || ''
    let activeDataIdText = document.querySelector(`button[data-id="${activeEpisodeId}"]`)?.textContent.trim() || ''

    let selectorFromServer = filteredLinks.map((a, index) => {
        let episodeDiv = a.closest('div[id^="episode-"]')
        let episodeId = episodeDiv?.id.replace('episode-', '') || ''
        let dataIdText = document.querySelector(`button[data-id="${episodeId}"]`)?.textContent.trim() || ''

        return {
            html: dataIdText == 'Vietsub' ? 'Tiếng gốc' : dataIdText,
            value: index,
            href: a.href,
            default: a.href === href,
        }
    })

    return { movie_id, activeDataIdText, selectorFromServer }
}

let messageTimeoutId = null

function showMessage(message, duration = 0) {
    const el = document.querySelector('.art-layer-auto-notice')
    if (!el) return
    if (messageTimeoutId) {
        clearTimeout(messageTimeoutId)
        messageTimeoutId = null
    }
    el.classList.remove('v-hidden')
    el.textContent = message
    if (duration > 0) {
        messageTimeoutId = setTimeout(() => {
            el.classList.add('v-hidden')
            messageTimeoutId = null
        }, duration)
    }
}

function playM3u8(video, url, art) {
    if (Hls.isSupported()) {
        if (art.hls) art.hls.destroy()
        art.hls = new Hls({
            fragLoadingMaxRetry: 60,
            fragLoadingRetryDelay: 3000,
            fragLoadingMaxRetryTimeout: 180000,
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            maxBufferSize: 150 * 1000 * 1000,
            maxBufferHole: 0.5,
            backBufferLength: 60,
            enableWorker: true,
            lowLatencyMode: false,
        })
        art.hls.loadSource(url)
        art.hls.attachMedia(video)
        art.hls.on(Hls.Events.ERROR, function (_, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        if (data?.details === 'manifestLoadError') {
                            showMessage('Phim đang được upload, vui lòng quay lại sau')
                        } else {
                            showMessage('Mất mạng, đang thử kết nối lại...', 5000)
                            setTimeout(() => {
                                art.hls.startLoad()
                                art.hls.recoverMediaError()
                            }, 1000)
                        }
                        break
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        showMessage('Lỗi media, đang khôi phục...', 5000)
                        art.hls.recoverMediaError()
                        break
                    default:
                        showMessage('Lỗi nghiêm trọng, dừng phát...')
                        art.hls.destroy()
                        break
                }
            } else if (Hls.ErrorTypes.NETWORK_ERROR && data?.details === 'fragLoadError') {
                showMessage('Mất mạng, đang thử kết nối lại...', 5000)
                art.hls.startLoad()
            }
        })
        art.on('destroy', () => art.hls.destroy())
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
    } else {
        showMessage('Trình duyệt không hỗ trợ phát video')
    }
}

let noSleep = new NoSleep()

function renderPlayer(type, link, id) {
    if (type == 'embed') {
        fetch('/phim/' + movie_slug + '/view')
        document.getElementById('player-wrapper').innerHTML = `<iframe width="100%" height="100%" src="${link}" frameborder="0" scrolling="no" allowfullscreen="" allow='autoplay'></iframe>`
        try {
            let histories = JSON.parse(localStorage['phim1080-histories'] || '[]')
            histories = histories.filter((item) => item.id !== data.id)
            histories.unshift(data)
            histories = histories.slice(0, 28)
            localStorage['phim1080-histories'] = JSON.stringify(histories)
        } catch (error) {
            console.log(error)
            localStorage.removeItem('phim1080-histories')
        }
    }
    if (type == 'm3u8') {
        let timeoutId = null
        let resumeKey = 'phim1080-playerposition-' + id
        let nextSlug = getNextPrevEpisode(true)
        let autoData = getAudioUrl(data.type)
        let language = {
            vi: {
                'Video Info': 'Thông tin video',
                Close: 'Đóng',
                'Video Load Failed': 'Tải video thất bại',
                Volume: 'Âm lượng',
                Play: 'Phát',
                Pause: 'Tạm dừng',
                Rate: 'Tốc độ',
                Mute: 'Tắt tiếng',
                'Video Flip': 'Lật video',
                Horizontal: 'Ngang',
                Vertical: 'Dọc',
                Reconnect: 'Kết nối lại',
                'Show Setting': 'Cài đặt',
                'Hide Setting': 'Ẩn cài đặt',
                Screenshot: 'Chụp màn hình',
                'Play Speed': 'Tốc độ phát',
                'Aspect Ratio': 'Tỷ lệ khung hình',
                Default: 'Mặc định',
                Normal: 'Bình thường',
                Open: 'Mở',
                'Switch Video': 'Chuyển video',
                'Switch Subtitle': 'Chuyển phụ đề',
                Fullscreen: 'Toàn màn hình',
                'Exit Fullscreen': 'Thoát toàn màn hình',
                'Web Fullscreen': 'Toàn màn hình trình duyệt',
                'Exit Web Fullscreen': 'Thoát toàn màn hình trình duyệt',
                'Mini player': 'Trình phát mini',
                'PIP Mode': 'Phát trong hình',
                'Exit PIP Mode': 'Thoát phát trong hình',
                'PIP Not Supported': 'Không hỗ trợ phát trong hình',
                'Fullscreen Not Supported': 'Không hỗ trợ toàn màn hình',
                'Subtitle Offset': 'Độ trễ phụ đề',
                'Last Seen': 'Lần xem cuối',
                'Jump Play': 'Nhảy đến đoạn phát',
                AirPlay: 'AirPlay',
                'AirPlay Not Available': 'AirPlay không khả dụng',
            },
        }
        let controls = []
        if (!Artplayer.utils.isMobile) {
            controls = [
                {
                    position: 'left',
                    name: 'fast-rewind',
                    index: 11,
                    html: '<i class="art-icon"><div class="art-inc-icon"><svg width="396" height="430" viewBox="0 0 396 430" fill="none" xmlns="http://www.w3.org/2000/svg"> <g fill="currentColor"> <path d="M237.342 26.3129C243.281 20.3742 243.281 10.7449 237.342 4.80589C231.403 -1.13321 221.773 -1.13321 215.835 4.80589L178.779 41.8615C178.72 41.9187 178.661 41.9765 178.603 42.0348C175.633 45.0044 174.148 48.8971 174.149 52.7894C174.148 56.6821 175.633 60.5748 178.603 63.5444C178.661 63.6027 178.72 63.6605 178.779 63.7178L215.835 100.773C221.773 106.713 231.403 106.713 237.342 100.773C243.281 94.8342 243.281 85.205 237.342 79.2663L225.235 67.1593C254.972 72.106 283 85.0372 306.208 104.807C336.452 130.57 356.532 166.263 362.848 205.487C369.165 244.711 361.305 284.903 340.677 318.858C320.05 352.813 288.003 378.312 250.282 390.783C212.56 403.255 171.63 401.885 134.828 386.919C98.0256 371.951 67.7562 344.366 49.4459 309.108C31.1355 273.849 25.9816 233.222 34.9071 194.508C43.8326 155.794 66.2547 121.524 98.1538 97.8413C104.898 92.8343 106.306 83.3091 101.299 76.5649C96.2924 69.8212 86.7666 68.4135 80.0229 73.4199C42.3199 101.412 15.8181 141.916 5.26888 187.674C-5.28085 233.432 0.811443 281.452 22.4528 323.125C44.0947 364.8 79.8708 397.403 123.37 415.093C166.868 432.784 215.246 434.403 259.83 419.662C304.414 404.921 342.292 374.783 366.672 334.65C391.052 294.517 400.343 247.012 392.877 200.651C385.412 154.291 361.679 112.104 325.932 81.653C297.666 57.5743 263.349 42.0784 227.007 36.6477L237.342 26.3129Z"> </path> <path d="M150.883 149.325C150.883 131.568 129.676 122.388 116.729 134.54L90.9877 158.701C84.8635 164.449 84.5588 174.073 90.3069 180.197C96.055 186.321 105.68 186.626 111.803 180.878L120.467 172.746V312.954C120.467 321.354 127.276 328.162 135.675 328.162C144.074 328.162 150.883 321.354 150.883 312.954V149.325Z"> </path> <path fill-rule="evenodd" clip-rule="evenodd" d="M190.579 187.772C190.579 159.154 213.779 135.953 242.398 135.953C271.016 135.953 294.217 159.154 294.217 187.772V276.358C294.217 304.976 271.016 328.176 242.398 328.176C213.779 328.176 190.579 304.976 190.579 276.358V187.772ZM263.801 187.772V276.358C263.801 288.178 254.218 297.761 242.398 297.761C230.577 297.761 220.995 288.178 220.995 276.358V187.772C220.995 175.952 230.577 166.369 242.398 166.369C254.218 166.369 263.801 175.952 263.801 187.772Z"> </path> </g> </svg></div></i>',
                    tooltip: '10 giây trước',
                    click: function () {
                        window.player.seek = this.currentTime - 10
                    },
                },
                {
                    position: 'left',
                    name: 'fast-forward',
                    index: 12,
                    html: '<i class="art-icon"><div class="art-inc-icon"><svg width="396" height="430" viewBox="0 0 396 430" fill="none" xmlns="http://www.w3.org/2000/svg"> <g fill="currentColor"> <path d="M158.267 26.3129C152.327 20.3742 152.327 10.7449 158.267 4.80589C164.206 -1.13321 173.835 -1.13321 179.774 4.80589L216.829 41.8615C216.889 41.9187 216.947 41.9765 217.005 42.0348C219.975 45.0044 221.46 48.8971 221.46 52.7894C221.46 56.6821 219.975 60.5748 217.005 63.5444C216.947 63.6027 216.889 63.6605 216.829 63.7178L179.774 100.773C173.835 106.713 164.206 106.713 158.267 100.773C152.327 94.8342 152.327 85.205 158.267 79.2663L170.374 67.1593C140.637 72.106 112.608 85.0372 89.4001 104.807C59.1561 130.57 39.0766 166.263 32.7602 205.487C26.4439 244.711 34.3038 284.903 54.9314 318.858C75.5589 352.813 107.605 378.312 145.327 390.783C183.048 403.255 223.978 401.885 260.781 386.919C297.583 371.951 327.852 344.366 346.163 309.108C364.473 273.849 369.627 233.222 360.701 194.508C351.776 155.794 329.354 121.524 297.455 97.8413C290.711 92.8343 289.303 83.3091 294.31 76.5649C299.316 69.8212 308.842 68.4135 315.585 73.4199C353.288 101.412 379.79 141.916 390.34 187.674C400.889 233.432 394.797 281.452 373.156 323.125C351.514 364.8 315.738 397.403 272.239 415.093C228.74 432.784 180.363 434.403 135.778 419.662C91.1941 404.921 53.3168 374.783 28.9365 334.65C4.55614 294.517 -4.73438 247.012 2.73119 200.651C10.1968 154.291 33.9297 112.104 69.6765 81.653C97.9424 57.5743 132.259 42.0784 168.601 36.6477L158.267 26.3129Z"> </path> <path d="M150.883 149.325C150.883 131.568 129.676 122.388 116.729 134.54L90.9877 158.701C84.8635 164.449 84.5588 174.073 90.3069 180.197C96.055 186.321 105.68 186.626 111.803 180.878L120.467 172.746V312.954C120.467 321.354 127.276 328.162 135.675 328.162C144.074 328.162 150.883 321.354 150.883 312.954V149.325Z"> </path> <path fill-rule="evenodd" clip-rule="evenodd" d="M190.579 187.772C190.579 159.154 213.779 135.953 242.398 135.953C271.016 135.953 294.217 159.154 294.217 187.772V276.358C294.217 304.976 271.016 328.176 242.398 328.176C213.779 328.176 190.579 304.976 190.579 276.358V187.772ZM263.801 187.772V276.358C263.801 288.178 254.218 297.761 242.398 297.761C230.577 297.761 220.995 288.178 220.995 276.358V187.772C220.995 175.952 230.577 166.369 242.398 166.369C254.218 166.369 263.801 175.952 263.801 187.772Z"> </path> </g> </svg></div></i>',
                    tooltip: '10 giây sau',
                    click: function () {
                        window.player.seek = this.currentTime + 10
                    },
                },
            ]
        }
        if (typeof nextSlug !== 'undefined' && nextSlug) {
            controls.push({
                position: 'right',
                name: 'change-video',
                html: `<i class="art-icon"><div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-skip-forward"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg></div></i>`,
                tooltip: 'Tập tiếp',
                click: function () {
                    window.location.href = nextSlug
                },
            })
        }
        let settings = [
            {
                name: 'setting-playback-rate',
                html: 'Tốc độ phát',
                tooltip: 'Chuẩn',
                icon: `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M10 8v8l6-4zM6.3 5l-.6-.8C7.2 3 9 2.2 11 2l.1 1c-1.8.2-3.4.9-4.8 2M5 6.3l-.8-.6C3 7.2 2.2 9 2 11l1 .1c.2-1.8.9-3.4 2-4.8m0 11.4c-1.1-1.4-1.8-3.1-2-4.8L2 13c.2 2 1 3.8 2.2 5.4zm6.1 3.3c-1.8-.2-3.4-.9-4.8-2l-.6.8C7.2 21 9 21.8 11 22zM22 12c0-5.2-3.9-9.4-9-10l-.1 1c4.6.5 8.1 4.3 8.1 9s-3.5 8.5-8.1 9l.1 1c5.2-.5 9-4.8 9-10" style="--darkreader-inline-fill:#a8a6a4"></path></svg>`,
                selector: [
                    { html: '0.5x', value: 0.5 },
                    { html: '0.75x', value: 0.75 },
                    { default: true, html: 'Chuẩn', value: 1 },
                    { html: '1.25x', value: 1.25 },
                    { html: '1.5x', value: 1.5 },
                    { html: '2x', value: 2 },
                ],
                onSelect: function (item) {
                    this.video.playbackRate = item.value
                    return item.html
                },
            },
            {
                name: 'setting-aspect-ratio',
                html: 'Thu phóng',
                width: 250,
                tooltip: 'Mặc định',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;transform:translate(0,0)" viewBox="0 0 88 88"><defs><clipPath id="a"><path d="M0 0h88v88H0z"></path></clipPath></defs><g clip-path="url('#a')" style="display:block"><path fill="#FFF" d="m12.438-12.702-2.82 2.82c-.79.79-.79 2.05 0 2.83l7.07 7.07-7.07 7.07c-.79.79-.79 2.05 0 2.83l2.82 2.83c.79.78 2.05.78 2.83 0l11.32-11.31c.78-.78.78-2.05 0-2.83l-11.32-11.31c-.78-.79-2.04-.79-2.83 0m-24.88 0c-.74-.74-1.92-.78-2.7-.12l-.13.12-11.31 11.31a2 2 0 0 0-.12 2.7l.12.13 11.31 11.31a2 2 0 0 0 2.7.12l.13-.12 2.83-2.83c.74-.74.78-1.91.11-2.7l-.11-.13-7.07-7.07 7.07-7.07c.74-.74.78-1.91.11-2.7l-.11-.13zM28-28c4.42 0 8 3.58 8 8v40c0 4.42-3.58 8-8 8h-56c-4.42 0-8-3.58-8-8v-40c0-4.42 3.58-8 8-8z" style="--darkreader-inline-fill:#a8a6a4" transform="translate(44 44)"></path></g></svg>`,
                selector: [
                    { default: true, html: 'Mặc định', value: 0 },
                    { html: '1.1x', value: 1.1 },
                    { html: '1.2x', value: 1.2 },
                    { html: '1.3x', value: 1.3 },
                ],
                onSelect: function (item) {
                    let video = document.querySelector('.art-video')
                    if (!video) return item.html

                    if (item.value > 0) {
                        video.style.transform = `scale(${item.value})`
                        video.style.transformOrigin = 'center center'
                    } else {
                        video.style.transform = ''
                        video.style.transformOrigin = ''
                    }
                    return item.html
                },
            },
            {
                name: 'setting-shutdown',
                html: 'Hẹn giờ ngủ',
                width: 250,
                tooltip: 'Tắt',
                icon: `<svg height="24" viewBox="0 0 24 24" width="24"><path d="M16.67,4.31C19.3,5.92,21,8.83,21,12c0,4.96-4.04,9-9,9c-2.61,0-5.04-1.12-6.72-3.02C5.52,17.99,5.76,18,6,18 c6.07,0,11-4.93,11-11C17,6.08,16.89,5.18,16.67,4.31 M14.89,2.43C15.59,3.8,16,5.35,16,7c0,5.52-4.48,10-10,10 c-1,0-1.97-0.15-2.89-0.43C4.77,19.79,8.13,22,12,22c5.52,0,10-4.48,10-10C22,7.48,19,3.67,14.89,2.43L14.89,2.43z M12,6H6v1h4.5 L6,10.99v0.05V12h6v-1H7.5L12,7.01V6.98V6L12,6z" fill="#fff"></path></svg>`,
                selector: [
                    { default: true, html: 'Tắt', value: 0 },
                    { html: '5 phút', value: 5 },
                    { html: '10 phút', value: 10 },
                    { html: '15 phút', value: 15 },
                    { html: '20 phút', value: 20 },
                    { html: '30 phút', value: 30 },
                ],
                onSelect: function (item) {
                    clearTimeout(timeoutId)
                    if (item.value > 0) {
                        timeoutId = setTimeout(() => {
                            window.player.pause()
                            document.querySelector('.art-setting-item[data-name="setting-shutdown"]')?.click()
                        }, item.value * 60 * 1000)
                    }
                    return item.html
                },
            },
            {
                name: 'setting-audio',
                html: 'Âm thanh',
                width: 250,
                tooltip: autoData.activeDataIdText == 'Vietsub' ? 'Tiếng gốc' : autoData.activeDataIdText,
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80l0-16 0-48 0-48C0 146.6 114.6 32 256 32s256 114.6 256 256l0 48 0 48 0 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"></path></svg>`,
                selector: autoData.selectorFromServer,
                onSelect: function (item) {
                    let selected = autoData.selectorFromServer.find((i) => i.value === item.value)
                    if (selected && selected.href) {
                        let position = localStorage.getItem('phim1080-playerposition-' + autoData.movie_id)
                        if (position) {
                            let movie_id = selected.href.split('/').filter(Boolean).pop().match(/\d+$/)?.[0]
                            localStorage.setItem('phim1080-playerposition-' + movie_id, position)
                        }
                        window.location.href = selected.href
                    }
                    return item.html
                },
            },
        ]
        let plugins = [
            artplayerPluginHlsControl({
                quality: {
                    control: false,
                    setting: true,
                    title: 'Chất lượng',
                    auto: 'Tự động',
                    getName: ({ height: h }) => (h > 1440 ? '4K' : h > 1080 ? '2K' : h > 720 ? '1080P' : h > 480 ? '720P' : h > 360 ? '480P' : '360P'),
                },
            }),
        ]
        if (navigator.userAgentData ? navigator.userAgentData.brands.some((b) => /Chromium|Google Chrome/.test(b.brand)) : /Chrome|Chromium/.test(navigator.userAgent) && !/OPR|Edg/.test(navigator.userAgent)) {
            plugins.push(
                artplayerPluginChromecast({
                    sdk: 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
                    icon: '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-cast"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line></svg></div>',
                })
            )
        }
        if (!Artplayer.utils.isMobile) {
            plugins.push(
                artplayerPluginAutoThumbnail({
                    width: 160,
                    number: 100,
                    scale: 1,
                })
            )
        }
        let layers = [
            {
                html: `<div class="art-player-top"><div class="p-t-left"><div class="video-info"><div class="name">${data.name}</div><div class="info">${data.episode_name}</div></div></div></div>`,
            },
            {
                html: `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><div class="cs-mask cursor-pointer"><svg id="pause-icon" width="40" height="40" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2m8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2"></path></svg><svg id="play-icon" width="40" height="40" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.982 9.275 8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45"></path></svg></div></div>`,
                click: function () {
                    window.player.controls.timer = Date.now()
                    window.player.playing ? window.player.pause() : window.player.play()
                },
            },
            {
                html: `<div style="position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%);"><div class="cs-mask cursor-pointer"><svg width="22" height="22" viewBox="0 0 396 430" fill="none" xmlns="http://www.w3.org/2000/svg"> <g fill="currentColor"> <path d="M237.342 26.3129C243.281 20.3742 243.281 10.7449 237.342 4.80589C231.403 -1.13321 221.773 -1.13321 215.835 4.80589L178.779 41.8615C178.72 41.9187 178.661 41.9765 178.603 42.0348C175.633 45.0044 174.148 48.8971 174.149 52.7894C174.148 56.6821 175.633 60.5748 178.603 63.5444C178.661 63.6027 178.72 63.6605 178.779 63.7178L215.835 100.773C221.773 106.713 231.403 106.713 237.342 100.773C243.281 94.8342 243.281 85.205 237.342 79.2663L225.235 67.1593C254.972 72.106 283 85.0372 306.208 104.807C336.452 130.57 356.532 166.263 362.848 205.487C369.165 244.711 361.305 284.903 340.677 318.858C320.05 352.813 288.003 378.312 250.282 390.783C212.56 403.255 171.63 401.885 134.828 386.919C98.0256 371.951 67.7562 344.366 49.4459 309.108C31.1355 273.849 25.9816 233.222 34.9071 194.508C43.8326 155.794 66.2547 121.524 98.1538 97.8413C104.898 92.8343 106.306 83.3091 101.299 76.5649C96.2924 69.8212 86.7666 68.4135 80.0229 73.4199C42.3199 101.412 15.8181 141.916 5.26888 187.674C-5.28085 233.432 0.811443 281.452 22.4528 323.125C44.0947 364.8 79.8708 397.403 123.37 415.093C166.868 432.784 215.246 434.403 259.83 419.662C304.414 404.921 342.292 374.783 366.672 334.65C391.052 294.517 400.343 247.012 392.877 200.651C385.412 154.291 361.679 112.104 325.932 81.653C297.666 57.5743 263.349 42.0784 227.007 36.6477L237.342 26.3129Z"> </path> <path d="M150.883 149.325C150.883 131.568 129.676 122.388 116.729 134.54L90.9877 158.701C84.8635 164.449 84.5588 174.073 90.3069 180.197C96.055 186.321 105.68 186.626 111.803 180.878L120.467 172.746V312.954C120.467 321.354 127.276 328.162 135.675 328.162C144.074 328.162 150.883 321.354 150.883 312.954V149.325Z"> </path> <path fill-rule="evenodd" clip-rule="evenodd" d="M190.579 187.772C190.579 159.154 213.779 135.953 242.398 135.953C271.016 135.953 294.217 159.154 294.217 187.772V276.358C294.217 304.976 271.016 328.176 242.398 328.176C213.779 328.176 190.579 304.976 190.579 276.358V187.772ZM263.801 187.772V276.358C263.801 288.178 254.218 297.761 242.398 297.761C230.577 297.761 220.995 288.178 220.995 276.358V187.772C220.995 175.952 230.577 166.369 242.398 166.369C254.218 166.369 263.801 175.952 263.801 187.772Z"> </path> </g> </svg></div></div>`,
                disable: !Artplayer.utils.isMobile,
                click: function () {
                    window.player.controls.timer = Date.now()
                    window.player.seek = this.currentTime - 10
                },
            },
            {
                html: `<div style="position: absolute; top: 50%; right: 25%; transform: translate(50%, -50%);"><div class="cs-mask cursor-pointer"><svg width="22" height="22" viewBox="0 0 396 430" fill="none" xmlns="http://www.w3.org/2000/svg"> <g fill="currentColor"> <path d="M158.267 26.3129C152.327 20.3742 152.327 10.7449 158.267 4.80589C164.206 -1.13321 173.835 -1.13321 179.774 4.80589L216.829 41.8615C216.889 41.9187 216.947 41.9765 217.005 42.0348C219.975 45.0044 221.46 48.8971 221.46 52.7894C221.46 56.6821 219.975 60.5748 217.005 63.5444C216.947 63.6027 216.889 63.6605 216.829 63.7178L179.774 100.773C173.835 106.713 164.206 106.713 158.267 100.773C152.327 94.8342 152.327 85.205 158.267 79.2663L170.374 67.1593C140.637 72.106 112.608 85.0372 89.4001 104.807C59.1561 130.57 39.0766 166.263 32.7602 205.487C26.4439 244.711 34.3038 284.903 54.9314 318.858C75.5589 352.813 107.605 378.312 145.327 390.783C183.048 403.255 223.978 401.885 260.781 386.919C297.583 371.951 327.852 344.366 346.163 309.108C364.473 273.849 369.627 233.222 360.701 194.508C351.776 155.794 329.354 121.524 297.455 97.8413C290.711 92.8343 289.303 83.3091 294.31 76.5649C299.316 69.8212 308.842 68.4135 315.585 73.4199C353.288 101.412 379.79 141.916 390.34 187.674C400.889 233.432 394.797 281.452 373.156 323.125C351.514 364.8 315.738 397.403 272.239 415.093C228.74 432.784 180.363 434.403 135.778 419.662C91.1941 404.921 53.3168 374.783 28.9365 334.65C4.55614 294.517 -4.73438 247.012 2.73119 200.651C10.1968 154.291 33.9297 112.104 69.6765 81.653C97.9424 57.5743 132.259 42.0784 168.601 36.6477L158.267 26.3129Z"> </path> <path d="M150.883 149.325C150.883 131.568 129.676 122.388 116.729 134.54L90.9877 158.701C84.8635 164.449 84.5588 174.073 90.3069 180.197C96.055 186.321 105.68 186.626 111.803 180.878L120.467 172.746V312.954C120.467 321.354 127.276 328.162 135.675 328.162C144.074 328.162 150.883 321.354 150.883 312.954V149.325Z"> </path> <path fill-rule="evenodd" clip-rule="evenodd" d="M190.579 187.772C190.579 159.154 213.779 135.953 242.398 135.953C271.016 135.953 294.217 159.154 294.217 187.772V276.358C294.217 304.976 271.016 328.176 242.398 328.176C213.779 328.176 190.579 304.976 190.579 276.358V187.772ZM263.801 187.772V276.358C263.801 288.178 254.218 297.761 242.398 297.761C230.577 297.761 220.995 288.178 220.995 276.358V187.772C220.995 175.952 230.577 166.369 242.398 166.369C254.218 166.369 263.801 175.952 263.801 187.772Z"> </path> </g> </svg></div></div>`,
                disable: !Artplayer.utils.isMobile,
                click: function () {
                    window.player.controls.timer = Date.now()
                    window.player.seek = this.currentTime + 10
                },
            },
            {
                html: `<div class="art-layer-auto-notice v-hidden" style="display: flex;"></div>`,
            },
        ]
        if (window.player) {
            window.player.destroy();
            window.player = null;
        }
        window.player = new Artplayer({
            container: '#player-wrapper',
            url: link,
            poster: poster,
            autoplay: true,
            autoSize: false,
            preload: 'auto',
            pip: document.pictureInPictureEnabled || false,
            loop: false,
            mutex: true,
            setting: true,
            flip: false,
            lock: false,
            gesture: false,
            fastForward: false,
            playbackRate: false,
            aspectRatio: false,
            theme: '#d32f2f',
            fullscreen: true,
            fullscreenWeb: !Artplayer.utils.isMobile,
            autoOrientation: true,
            airplay: 'WebKitPlaybackTargetAvailabilityEvent' in window,
            whitelist: ['*'],
            lang: 'vi',
            i18n: language,
            controls: controls,
            plugins: plugins,
            settings: settings,
            layers: layers,
            moreVideoAttr: {
                crossOrigin: 'anonymous',
            },
            customType: {
                m3u8: playM3u8,
            },
            icons: {
                fullscreenOn:
                    '<div class="art-inc-icon"><svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.73 55C21.3421 55 23.4601 53.1121 23.4601 50.5L23.4601 27.4601L48 27.4601C50.6121 27.4601 53 25.3421 53 22.7301C53 20.118 50.6121 18 48 18L18.73 18C16.118 18 14 20.118 14 22.73L14 50.5C14 53.1121 16.118 55 18.73 55Z" fill="currentColor"></path> <path d="M53.9997 105.27C53.9997 102.658 51.6118 100.54 48.9997 100.54L23.4601 100.54L23.4601 78C23.4601 75.3879 21.3421 73 18.73 73C16.118 73 14 75.3879 14 78L14 105.27C14 107.882 16.118 110 18.73 110L48.9997 110C51.6118 110 53.9997 107.882 53.9997 105.27Z" fill="currentColor"></path> <path d="M74 22.73C74 25.3421 76.3879 27.4601 79 27.4601L104.54 27.46L104.54 50C104.54 52.6121 106.658 55 109.27 55C111.882 55 114 52.6121 114 50L114 22.73C114 20.118 111.882 18 109.27 18L79 18C76.3879 18 74 20.118 74 22.73Z" fill="currentColor"></path> <path d="M109.27 72C106.658 72 104.54 74.3879 104.54 77V100.54L80 100.54C77.3879 100.54 75 102.658 75 105.27C75 107.882 77.3879 110 80 110L109.27 110C111.882 110 114 107.882 114 105.27V77C114 74.3879 111.882 72 109.27 72Z" fill="currentColor"></path> </svg></div>',
                fullscreenOff:
                    '<div class="art-inc-icon"><svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M79.73 111C82.3421 111 84.4601 108.112 84.4601 105.5L84.4601 84.4601L109 84.4601C111.612 84.4601 114 82.3421 114 79.73C114 77.118 111.612 75 109 75L79.73 75C77.118 75 75 77.118 75 79.73L75 105.5C75 108.112 77.118 111 79.73 111Z" fill="currentColor"></path> <path d="M114 48.27C114 45.6579 111.612 43.5399 109 43.5399L83.4601 43.5399L83.4601 23C83.4601 20.3879 81.3421 18 78.73 18C76.118 18 74 20.3879 74 23L74 48.27C74 50.882 76.118 53 78.73 53L109 53C111.612 53 114 50.882 114 48.27Z" fill="currentColor"></path> <path d="M14 79.73C14 82.3421 16.3879 84.46 19 84.46L44.5396 84.46L44.5396 105.5C44.5396 108.112 46.6576 110.5 49.2697 110.5C51.8818 110.5 53.9997 108.112 53.9997 105.5L53.9997 79.73C53.9997 77.118 51.8818 75 49.2697 75L19 75C16.3879 75 14 77.118 14 79.73Z" fill="currentColor"></path> <path d="M48.27 18C45.6579 18 43.5399 20.3879 43.5399 23V44.5396L19 44.5396C16.3879 44.5396 14 46.6576 14 49.2697C14 51.8818 16.3879 53.9997 19 53.9997L48.27 53.9997C50.882 53.9997 53 51.8818 53 49.2697L53 23C53 20.3879 50.882 18 48.27 18Z" fill="currentColor"></path> </svg></div>',
                fullscreenWebOn:
                    '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></div>',
                fullscreenWebOff:
                    '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minimize-2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></div>',
                volume: '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div>',
                volumeClose:
                    '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg></div>',
                pause: '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></div>',
                play: '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>',
                pip: '<div class="art-inc-icon"><svg width="98" height="98" viewBox="0 0 98 98" fill="#fff" xmlns="http://www.w3.org/2000/svg"> <path d="M4.08334 14.1667C4.08334 10.853 6.76964 8.16675 10.0833 8.16675H75.6667C78.9804 8.16675 81.6667 10.853 81.6667 14.1667V35.6251C81.6667 37.374 80.2489 38.7917 78.5 38.7918V38.7918V38.7918C76.8432 38.7918 75.5 37.4486 75.5 35.7918V26.5V20.5C75.5 17.1863 72.8137 14.5 69.5 14.5L17 14.5C13.6863 14.5 11 17.1863 11 20.5V56.5C11 59.8137 13.6863 62.5 17 62.5L21 62.5C22.933 62.5 24.5 64.067 24.5 66V66V66C24.5 67.887 22.9703 69.4167 21.0833 69.4167H10.0833C6.76963 69.4167 4.08334 66.7305 4.08334 63.4167V14.1667Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M36.75 53.0833C36.75 50.8282 38.5782 49 40.8333 49H89.8333C92.0885 49 93.9167 50.8282 93.9167 53.0833V85.75C93.9167 88.0052 92.0885 89.8333 89.8333 89.8333H40.8333C38.5782 89.8333 36.75 88.0052 36.75 85.75V53.0833ZM49 57.1667C46.7448 57.1667 44.9167 58.9948 44.9167 61.25V77.5833C44.9167 79.8385 46.7448 81.6667 49 81.6667H81.6667C83.9218 81.6667 85.75 79.8385 85.75 77.5833V61.25C85.75 58.9948 83.9218 57.1667 81.6667 57.1667H49Z" fill="currentColor"></path> <path d="M40.8333 53.0833H89.8333V85.75H40.8333V53.0833Z" fill="currentColor"> </path> </svg></div>',
                setting:
                    '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /> <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> </svg></div>',
                airplay:
                    '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg></div>',
                loading:
                    '<svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}</style><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_P7sC"/></svg>',
                state: '<div class="art-inc-icon"><svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play-icon lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div>',
            },
        })
        let waitingTimer = null
        window.player.on('video:waiting', function () {
            if (waitingTimer) return
            waitingTimer = setTimeout(function () {
                if (window.hls) {
                    window.hls.stopLoad()
                    window.hls.startLoad(window.player.currentTime)
                }
                waitingTimer = null
            }, 10000)
        })
        window.player.on('video:playing', function () {
            if (waitingTimer) {
                clearTimeout(waitingTimer)
                waitingTimer = null
            }
        })
        window.player.once('video:playing', () => {
            fetch('/phim/' + movie_slug + '/view')
            document.querySelector('.mac-player').classList.remove('mac-player-start')
        })
        window.player.on('video:pause', function () {
            noSleep.disable()
        })
        window.player.on('video:play', function () {
            noSleep.enable()
        })
        window.player.on('video:ended', () => {
            noSleep.disable()
        })
        window.player.on('video:progress', () => {
            if (!window.player.currentTime) return
            localStorage.setItem(resumeKey, window.player.currentTime)
        })
        window.player.on('ready', () => {
            var progress = parseFloat(localStorage.getItem(resumeKey))
            if (isNaN(progress)) progress = 0
            window.player.seek = progress
            try {
                let histories = JSON.parse(localStorage['phim1080-histories'] || '[]')
                ;(data.duration = window.player.duration), (histories = histories.filter((item) => item.id !== data.id))
                histories.unshift(data)
                histories = histories.slice(0, 28)
                localStorage['phim1080-histories'] = JSON.stringify(histories)
            } catch (error) {
                console.log(error)
                localStorage.removeItem('phim1080-histories')
            }
        })
    }
}
document.addEventListener('DOMContentLoaded', function () {
    if (!isBot()) {
        renderPlayer(server.type, server.link, server.id)
    }
})
