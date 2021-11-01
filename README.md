# Campfire Songbook

### Description

Interactive songbook web based application for campfire events. 
It allows creating multiple sessions as host or join to existing one.
Host can choose and select a song which will be updated immediately on screen of joined people.

### Features

- Lightweight and mobile UI friendly
- Built in database with stored songs
- Filtering and sorting songs by author or title
- Chord diagrams with guitar and ukulele 
- Searching and saving songs from the Internet
- Song lyrics editor
- Play selected song on YouTube
- Share url to current session as guest
- Password protected session as host
- Multilingual support
- Changeable font size

### Screenshots

Home screen - create session as host or join as guest

![](img/home_screen.jpg)

Host screen - chords view with song lyrics

![](img/host_screen.jpg)

Song preview with saving to local db and selecting as current song

![](img/preview_screen.jpg)

Horizontal screen with example chord diagram (with switchable variations)

![](img/horizontal_chord_screen.jpg)

Preferences screen with language, instrument (guitar / ukulele) and font size options 

![](img/preferences_horizontal_screen.jpg)

Song editor screen - creating, updating and deleting songs

![](img/song_editor.jpg)

### To do:

- [x] Scroll to top after song being changed in guest mode
- [ ] More sources for external search integration
- [ ] Prevent screen for dimming
- [ ] Favourite songs for session
- [ ] Playlist for session
- [ ] PWA integration
- [ ] Highlighting chords in song editor

### Tech stack

#### Backend

- Java
- Spring Boot 
- Spring Data JPA
- Lombok
- Swagger
- JSoup
- H2 database
- Websockets

#### Frontend

- React - https://github.com/facebook/react
- Prime Faces UI - https://github.com/primefaces/primereact
- Axios - https://github.com/axios/axios
- Formik - https://github.com/formium/formik
- React i18next - https://github.com/i18next/react-i18next
- React Stomp - https://github.com/lahsivjar/react-stomp
- React Chords with json db - https://github.com/tombatossals/react-chords https://github.com/tombatossals/chords-db
- React Player - https://github.com/cookpete/react-player
- Prettier - https://github.com/prettier/prettier
- Typescript - https://github.com/microsoft/TypeScript

### Deployment

Deployment configuration for Caddy server with Let's Encrypt support:

Caddyfile:

```
example.com {
        templates
        encode gzip zstd
        reverse_proxy /api/* localhost:8090
        reverse_proxy /ws/* localhost:8090
        root * /var/www/html
        @notAPI {
                not {
                        path /api/*
                }
                file {
                        try_files {path} {path}/ /index.html
                }
        }
        rewrite @notAPI {http.matchers.file.relative}
        file_server
}
```
