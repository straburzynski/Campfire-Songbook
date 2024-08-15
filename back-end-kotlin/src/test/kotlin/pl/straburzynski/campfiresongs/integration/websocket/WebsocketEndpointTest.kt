package pl.straburzynski.campfiresongs.integration.websocket

import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.messaging.converter.ByteArrayMessageConverter
import org.springframework.messaging.converter.CompositeMessageConverter
import org.springframework.messaging.converter.SimpleMessageConverter
import org.springframework.messaging.converter.StringMessageConverter
import org.springframework.messaging.simp.stomp.StompFrameHandler
import org.springframework.messaging.simp.stomp.StompHeaders
import org.springframework.messaging.simp.stomp.StompSession
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter
import org.springframework.web.socket.client.standard.StandardWebSocketClient
import org.springframework.web.socket.messaging.WebSocketStompClient
import org.springframework.web.socket.sockjs.client.SockJsClient
import org.springframework.web.socket.sockjs.client.Transport
import org.springframework.web.socket.sockjs.client.WebSocketTransport
import pl.straburzynski.campfiresongs.BaseIntegrationTest
import pl.straburzynski.campfiresongs.utils.SessionFactory.createSession
import java.lang.reflect.Type
import java.util.concurrent.CompletableFuture
import java.util.concurrent.TimeUnit.SECONDS


class WebsocketEndpointTest : BaseIntegrationTest() {

    lateinit var stompClient: WebSocketStompClient
    lateinit var completableFuture: CompletableFuture<Any>
    lateinit var url: String

    @BeforeEach
    fun setup() {
        completableFuture = CompletableFuture()
        url = "ws://localhost:$port$WS_ENDPOINT"
        stompClient = WebSocketStompClient(SockJsClient(createTransportClient()))
        stompClient.messageConverter = CompositeMessageConverter(
            listOf(ByteArrayMessageConverter(), SimpleMessageConverter(), StringMessageConverter())
        )
    }

    @Test
    fun `should make subscription on topic`() {
        // given
        val createdSession = createSession(client)
        val subscriptions = mutableListOf<StompSession>()
        val stompSession = stompClient.connect(url, object : StompSessionHandlerAdapter() {
            override fun afterConnected(session: StompSession, connectedHeaders: StompHeaders) {
                subscriptions.add(session)
                super.afterConnected(session, connectedHeaders)
            }
        })[1, SECONDS]

        // when
        stompSession.subscribe(TOPIC_ENDPOINT + createdSession.name, CreateSongStompFrameHandler())

        // then
        stompSession.isConnected shouldBe true
        subscriptions shouldHaveSize 1
    }

    private fun createTransportClient(): List<Transport> {
        val transports: MutableList<Transport> = ArrayList(1)
        transports.add(WebSocketTransport(StandardWebSocketClient()))
        return transports
    }

    inner class CreateSongStompFrameHandler : StompFrameHandler {
        override fun getPayloadType(stompHeaders: StompHeaders): Type {
            return Any::class.java
        }

        override fun handleFrame(stompHeaders: StompHeaders, o: Any?) {
            completableFuture.complete(o)
        }
    }

    companion object {
        const val WS_ENDPOINT: String = "/api/ws-message/"
        const val TOPIC_ENDPOINT: String = "/topic/message/"
    }
}
