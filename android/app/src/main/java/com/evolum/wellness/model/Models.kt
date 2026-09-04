package com.evolum.wellness.model

data class SessionItem(
    val id: String,
    val title: String,
    val titleEn: String,
    val durationMinutes: Int,
    val category: String, // "focus", "relaxation", "sleep", "stressRelief", "beginner", "intermediate", "advanced"
    val isYoga: Boolean = false,
    val description: String = "",
    val audioUrl: String = ""
)

enum class BreathingPhase(val labelEn: String, val labelAr: String, val durationSeconds: Int) {
    INHALE("Inhale", "شهيق", 4),
    HOLD("Hold", "حبس النفس", 4),
    EXHALE("Exhale", "زفير", 4)
}

data class AuraMetrics(
    val heartRate: Int = 64,
    val metabolicAge: Int = 27,
    val auraAge: Int = 26,
    val chronologicalAge: Int = 30,
    val paceOfAging: Double = 0.88,
    val zone: String = "Optimal Longevity",
    val lastSync: String = "Just now",
    val status: String = "connected"
)

data class UserProgress(
    val streak: Int = 5,
    val sessionsCompleted: Int = 12,
    val minutesMeditated: Int = 145,
    val breathingCyclesCompleted: Int = 38,
    val weeklyActivity: List<Int> = listOf(20, 15, 30, 0, 25, 40, 15)
)

data class BadgeItem(
    val id: String,
    val title: String,
    val titleEn: String,
    val description: String,
    val requiredSessions: Int,
    val isUnlocked: Boolean
)

data class AICoachMessage(
    val id: String,
    val isUser: Boolean,
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)
