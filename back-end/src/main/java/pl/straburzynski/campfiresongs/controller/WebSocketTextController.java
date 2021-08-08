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
import pl.straburzynski.campfiresongs.model.SongDTO;

@RestController
@Slf4j
public class WebSocketTextController {

    private final SimpMessagingTemplate template;

    @Autowired
    public WebSocketTextController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SongDTO songDTO) {
        log.info(songDTO.toString());
        template.convertAndSend("/topic/message", songDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // websockets
    // client will send message to /app/sendMessage
    // "app" prefix from destination prefix
    @MessageMapping("/sendMessage")
    public void receiveMessage(@Payload SongDTO songDTO) {
        log.info(songDTO.toString());
        // receive message from client
    }


    @SendTo("/topic/message")
    public SongDTO broadcastMessage(@Payload SongDTO songDTO) {
        log.info(songDTO.toString());
        return songDTO;
    }
}
