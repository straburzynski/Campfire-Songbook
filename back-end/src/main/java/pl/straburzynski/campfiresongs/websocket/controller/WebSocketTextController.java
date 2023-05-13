package pl.straburzynski.campfiresongs.websocket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.song.model.Song;
import pl.straburzynski.campfiresongs.song.model.SongDto;
import pl.straburzynski.campfiresongs.song.service.SongService;

import java.util.List;
import java.util.Random;

@RestController
@RequiredArgsConstructor
@Slf4j
public class WebSocketTextController {

    private final SimpMessagingTemplate template;
    private final SongService songService;

    @PostMapping("/sendRandom")
    public ResponseEntity<?> sendTestMessage(@RequestParam("sessionName") String sessionName) {
        List<SongDto> songDtoList = songService.findAll();
        Random rand = new Random();
        SongDto songDto = songDtoList.get(rand.nextInt(songDtoList.size()));
        template.convertAndSend("/topic/message/" + sessionName, songDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Song song, @RequestParam("sessionName") String sessionName) {
        log.info(song.toString());
        template.convertAndSend("/topic/message/" + sessionName, song);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // websockets
    // client will send message to /app/sendMessage
    // "app" prefix from destination prefix
    @MessageMapping("/sendMessage")
    public void receiveMessage(@Payload Song song) {
        log.info(song.toString());
        // receive message from client
    }

    @SendTo("/topic/message")
    public Song broadcastMessage(@Payload Song song) {
        log.info(song.toString());
        return song;
    }
}
