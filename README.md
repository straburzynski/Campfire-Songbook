# Campfire Songbook

### Description

Interactive songbook web based application for campfire events. 
It allows creating multiple sessions as host or join to existing one.
Host can choose and select a song which will be updated immediately on screen of joined people.

### Features

- Lightweight and mobile UI friendly
- Filtering and sorting songs by author or title
- Chord diagrams for guitar and ukulele
- Transposing chords
- Searching and saving songs from the Internet
- Song lyrics and chords editor
- Play selected song on YouTube
- Share url to current session as guest
- Password protected session as host
- Multilingual support
- Changeable font size
- Offline mode - songs stored on the device
- Configurable columns count
- Pull to refresh session
- Auto scroll with speed options
- Played songs history

### Screenshots

Home screen - create session as host or join as guest

![](img/home_screen.jpg)

Host screen - chords view with song lyrics

![](img/host_screen.jpg)

Song preview with saving to local db and selecting as current song

![](img/preview_screen.jpg)

Chord diagram (with switchable variations)

![](img/horizontal_chord_screen.jpg)

App options screen

![](img/app_options.jpg)

Preferences screen with language and instrument selection (guitar / ukulele), font size, columns settings and offline mode

![](img/preferences_horizontal_screen.jpg)

Host options: chords transposition and autoscroll

![](img/transposition_and_autoscroll.jpg)

Song editor screen - creating, updating and deleting songs

![](img/song_editor.jpg)

### Changelog:

- 0.15.0 - Played songs history in session.
- 0.14.0 - Tuner for guitar and ukulele.
- 0.13.0 - Lyrics autoscroll with different speed options.
- 0.12.0 - 'Pull to refresh' available for session participant.
- 0.11.0 - Offline mode - using the application without access to the Internet. Internet connection required to download songs.
- 0.10.0 - 'About' section with changelog and current version.
- 0.9.0 - Favorite songs - new song list menu. Adding and removing from the list screen - menu in the magnifying glass icon.
- 0.8.0 - Automatic and manual column handling in options. Maximum 3 columns.
- 0.7.0 - Adding new data source in search - Ultimate Guitar. The source icon is shown in the results list.
- 0.6.0 - Adjusting the song view for printing.
- 0.5.0 - Song chord transposition. Only visible to the session host on the screen of the selected song.
- 0.4.0 - Configure font size, application language and instrument type (guitar or ukulele).
- 0.3.0 - Searching and playing the active song from Youtube.
- 0.2.0 - Sharing a link to join a session on mobile devices and in the browser
- 0.1.0 - Creating and joining existing sessions, searching songs from Songbook Wywrota and saving to local database.

### Tech stack

#### Backend

- Java
- Spring Boot, JPA - https://spring.io/projects/spring-boot
- REST - https://restfulapi.net
- Lombok - https://projectlombok.org
- Swagger - https://swagger.io
- JSoup - https://jsoup.org
- H2 database - https://www.h2database.com
- Websockets

#### Frontend

- React - https://github.com/facebook/react
- Prime Faces UI - https://github.com/primefaces/primereact
- Axios - https://github.com/axios/axios
- Formik - https://github.com/formium/formik
- React i18next - https://github.com/i18next/react-i18next
- React stomp hooks - https://github.com/SvenKirschbaum/react-stomp-hooks
- React Chords with json db - https://github.com/tombatossals/react-chords https://github.com/tombatossals/chords-db
- React Player - https://github.com/cookpete/react-player
- Prettier - https://github.com/prettier/prettier
- Typescript - https://github.com/microsoft/TypeScript

### Deployment

[Caddy 2 ](https://caddyserver.com/) is a powerful, enterprise-ready, open source web server with automatic HTTPS written in Go. 
It uses Let's Encrypt certificate and allows easily configure server with one simple file.

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
