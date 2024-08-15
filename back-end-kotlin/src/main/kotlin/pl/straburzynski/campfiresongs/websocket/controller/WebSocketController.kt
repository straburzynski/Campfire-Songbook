package pl.straburzynski.campfiresongs.websocket.controller

import org.springframework.http.HttpStatus.OK
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import pl.straburzynski.campfiresongs.song.model.Song
import java.util.logging.Logger


@RestController
class WebSocketTextController(
    private val template: SimpMessagingTemplate,
) {
    @PostMapping("/send")
    fun sendMessage(
        @RequestBody song: Song,
        @RequestParam("sessionName") sessionName: String
    ): ResponseEntity<Unit> {
        logger.info("@PostMapping(\"/send\")")
        logger.info(song.toString())
        template.convertAndSend("/topic/message/$sessionName", song)
        return ResponseEntity<Unit>(OK)
    }

    // websockets
    // client will send message to app/sendMessage
    // "app" prefix from destination prefix
    @MessageMapping("/sendMessage")
    fun receiveMessage(@Payload song: Song) {
        // receive message from client
        logger.info("@MessageMapping(\"/sendMessage\")\n")
        logger.info(song.toString())
    }

    @SubscribeMapping("/topic/message/{sessionName}")
    @SendTo("/topic/message/{sessionName}")
    fun broadcastMessage(@Payload song: Song): Song {
        logger.info("@SendTo(\"/topic/message\")")
        logger.info(song.toString())
        return song
    }

    companion object {
        val logger: Logger = Logger.getLogger(this::class.java.name)
    }
}
