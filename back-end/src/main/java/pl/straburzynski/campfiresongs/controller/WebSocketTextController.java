package pl.straburzynski.campfiresongs.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.straburzynski.campfiresongs.model.Song;
import pl.straburzynski.campfiresongs.repository.SongRepository;

import java.util.UUID;

@RestController
@Slf4j
public class WebSocketTextController {

    private final SimpMessagingTemplate template;
    private final SongRepository songRepository;

    @Autowired
    public WebSocketTextController(SimpMessagingTemplate template, SongRepository songRepository) {
        this.template = template;
        this.songRepository = songRepository;
    }

    @PostMapping("/sendTest")
    public ResponseEntity<?> sendTestMessage() {
        Song song = songRepository.findAll().stream().findFirst().orElse(new Song(UUID.randomUUID(), "author", "title", "lyrics"));
        template.convertAndSend("/topic/message", song);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Song song) {
        log.info(song.toString());
        template.convertAndSend("/topic/message", song);
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
