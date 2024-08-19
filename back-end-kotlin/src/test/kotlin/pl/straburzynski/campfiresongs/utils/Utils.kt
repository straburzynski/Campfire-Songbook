package pl.straburzynski.campfiresongs.utils

object Utils {
    fun randomString(length: Int): String =
        ('a'..'z').map { it }.shuffled().subList(0, length).joinToString("")

    fun getResourceAsText(path: String): String =
        checkNotNull(object {}.javaClass.getResource(path)?.readText()) {
            "No file found in path $path"
        }
}