package pl.straburzynski.campfiresongs.utils

object Utils {
    fun randomString(length: Int) =
        ('a'..'z').map { it }.shuffled().subList(0, length).joinToString("")
}