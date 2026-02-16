plugins {
    kotlin("multiplatform") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    id("com.android.library") version "8.2.2"
    `maven-publish`
    signing
    id("com.vanniktech.maven.publish") version "0.28.0"
}

group = "ink.mumin"
version = "1.0.0"

repositories {
    google()
    mavenCentral()
}

kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
    jvm()
    jvmToolchain(17)
    
    // iOS Targets
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-core:2.3.7")
                implementation("io.ktor:ktor-client-serialization:2.3.7")
                implementation("io.ktor:ktor-client-content-negotiation:2.3.7")
                implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
                implementation("io.ktor:ktor-client-mock:2.3.7")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
            }
        }
        val jvmMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-cio:2.3.7")
            }
        }
        val androidMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-okhttp:2.3.7")
            }
        }
        val iosX64Main by getting
        val iosArm64Main by getting
        val iosSimulatorArm64Main by getting
        val iosMain by creating {
            dependsOn(commonMain)
            iosX64Main.dependsOn(this)
            iosArm64Main.dependsOn(this)
            iosSimulatorArm64Main.dependsOn(this)
            dependencies {
                implementation("io.ktor:ktor-client-darwin:2.3.7")
            }
        }
    }
}

android {
    namespace = "ink.mumin.sdk"
    compileSdk = 34
    defaultConfig {
        minSdk = 21
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

mavenPublishing {
    publishToMavenCentral(com.vanniktech.maven.publish.SonatypeHost.CENTRAL_PORTAL)
    signAllPublications()
    coordinates("ink.mumin", "sdk", "1.0.0")

    pom {
        name.set("Mumin Kotlin SDK")
        description.set("Official Kotlin Multiplatform SDK for the Mumin Hadith API")
        url.set("https://github.com/mumin-ink/mumin-api")
        licenses {
            license {
                name.set("MIT License")
                url.set("https://opensource.org/licenses/MIT")
            }
        }
        developers {
            developer {
                id.set("mumin")
                name.set("Mumin Team")
                email.set("admin@mumin.ink")
            }
        }
        scm {
            connection.set("scm:git:github.com/mumin-ink/mumin-api.git")
            developerConnection.set("scm:git:ssh://github.com/mumin-ink/mumin-api.git")
            url.set("https://github.com/mumin-ink/mumin-api")
        }
    }
}

signing {
    val keyId = System.getenv("GPG_KEY_ID")
    val password = System.getenv("GPG_SIGNING_PASSWORD")
    val secretKey = System.getenv("GPG_SIGNING_KEY")

    if (secretKey != null && password != null && keyId != null) {
        useInMemoryPgpKeys(keyId, secretKey, password)
    }
}
