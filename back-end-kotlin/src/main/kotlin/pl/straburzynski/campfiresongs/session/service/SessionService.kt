package pl.straburzynski.campfiresongs.session.service

import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import pl.straburzynski.campfiresongs.session.exception.NotAuthorizedException
import pl.straburzynski.campfiresongs.session.exception.SessionNotFoundException
import pl.straburzynski.campfiresongs.session.model.Session
import pl.straburzynski.campfiresongs.session.model.SessionDto
import pl.straburzynski.campfiresongs.session.repository.SessionRepository
import pl.straburzynski.campfiresongs.song.service.SongConverter
import java.util.UUID
import java.util.logging.Logger
import kotlin.jvm.optionals.getOrNull


@Service
class SessionService(
    val sessionRepository: SessionRepository,
    val template: SimpMessagingTemplate,
    val songConverter: SongConverter,
    val sessionConverter: SessionConverter,
    val passwordEncoder: PasswordEncoder
) {
    fun findBySessionName(sessionName: String): SessionDto {
        val session: Session = sessionRepository.findByName(sessionName) ?: throw SessionNotFoundException(sessionName)
        return sessionConverter.convertFromSession(session)
    }

    fun createSession(sessionDto: SessionDto): SessionDto {
        val foundSession = sessionRepository.findByName(sessionDto.name)
        val session = if (foundSession != null) {
            checkPassword(sessionDto, foundSession)
            foundSession
        } else sessionRepository.save(
            Session(
                name = sessionDto.name,
                password = passwordEncoder.encode(sessionDto.password)
            )
        )
        logger.info("Create session, id: ${session.id}, name: ${session.name}")
        return sessionConverter.convertFromSession(session)
    }

    private fun checkPassword(sessionDto: SessionDto, session: Session) {
        if (sessionDto.password == null ||
            !passwordEncoder.matches(sessionDto.password, session.password)
        ) throw NotAuthorizedException()
    }

    fun updateSession(sessionDto: SessionDto): SessionDto {
        val sessionId = sessionDto.id ?: throw SessionNotFoundException()
        val foundSession = sessionRepository.findById(sessionId).getOrNull()
            ?: throw SessionNotFoundException(sessionDto.name)
        foundSession.temporary = sessionDto.temporary
        if (sessionDto.temporary) {
            foundSession.song = null
            foundSession.songData = sessionDto.song?.let { songConverter.stringifyFromSongDto(sessionDto.song) }
        } else {
            foundSession.song = sessionDto.song?.let { songConverter.convertFromSongDto(sessionDto.song) }
            foundSession.songData = null
        }
        val updatedSession = sessionRepository.save(foundSession)
        logger.info(
            "Update session, name: ${updatedSession.name}, temporary: ${updatedSession.temporary}, " +
                    "songId: ${if (updatedSession.temporary) "---" else updatedSession.song?.id}"
        )
        updatedSession.song?.let {
            template.convertAndSend("/topic/message/" + updatedSession.name, it)
        }
        return sessionConverter.convertFromSession(updatedSession)
    }

    fun deleteSession(id: UUID) {
        val foundSession = sessionRepository.findById(id).getOrNull() ?: throw SessionNotFoundException(id.toString())
        logger.info("Deleting session, id: ${foundSession.id}, name: ${foundSession.name}")
        sessionRepository.deleteById(id)
    }

    companion object {
        val logger: Logger = Logger.getLogger(this::class.java.name)
    }
}
