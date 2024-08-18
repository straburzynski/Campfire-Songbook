package pl.straburzynski.campfiresongs.unit

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe


class ExampleUnitTest : FunSpec({

    beforeSpec { println("Before") }

    test("Test") {
        1 + 2 shouldBe 3
    }

})