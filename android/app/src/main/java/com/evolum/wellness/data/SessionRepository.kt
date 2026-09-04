package com.evolum.wellness.data

import com.evolum.wellness.model.BadgeItem
import com.evolum.wellness.model.SessionItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SessionRepository {

    private val _meditations = listOf(
        SessionItem(
            id = "m1",
            title = "تنفس الصباح الحيوي",
            titleEn = "Morning Vitality Breath",
            durationMinutes = 5,
            category = "focus",
            description = "Start your day with diaphragmatic breathwork to awaken cellular vitality."
        ),
        SessionItem(
            id = "m2",
            title = "استرخاء مسائي وهدوء عصبي",
            titleEn = "Evening Neural Calm",
            durationMinutes = 10,
            category = "relaxation",
            description = "Soothe your vagus nerve and transition into a serene state of mind."
        ),
        SessionItem(
            id = "m3",
            title = "نوم عميق وترميم الخلايا",
            titleEn = "Deep Sleep & Cell Repair",
            durationMinutes = 20,
            category = "sleep",
            description = "Gentle delta-wave meditation to promote deep regenerative sleep cycles."
        ),
        SessionItem(
            id = "m4",
            title = "تخفيف التوتر وخفض الكورتيزول",
            titleEn = "Cortisol Reset & De-stress",
            durationMinutes = 10,
            category = "stressRelief",
            description = "A targeted somatic meditation to regulate stress hormones quickly."
        ),
        SessionItem(
            id = "m5",
            title = "لحظة يقظة وتوازن حيوي",
            titleEn = "Vital Equilibrium Moment",
            durationMinutes = 5,
            category = "relaxation",
            description = "Mid-day conscious reset to regain centered awareness and focus."
        )
    )

    private val _yogaSessions = listOf(
        SessionItem(
            id = "y1",
            title = "يوغا الصباح للمبتدئين",
            titleEn = "Morning Yoga for Beginners",
            durationMinutes = 15,
            category = "beginner",
            isYoga = true,
            description = "Gentle spinal mobility and joint opening sequences for morning flow."
        ),
        SessionItem(
            id = "y2",
            title = "تدفق الطاقة والحيوية",
            titleEn = "Vital Energy Flow",
            durationMinutes = 25,
            category = "intermediate",
            isYoga = true,
            description = "Invigorating Vinyasa flow focusing on stamina, core, and posture."
        ),
        SessionItem(
            id = "y3",
            title = "مرونة متقدمة وإطالة العضلات",
            titleEn = "Bio-Flexibility & Range",
            durationMinutes = 40,
            category = "advanced",
            isYoga = true,
            description = "Deep fascia stretching and flexibility conditioning for longevity."
        ),
        SessionItem(
            id = "y4",
            title = "يوغا الاسترخاء الليلي",
            titleEn = "Nocturnal Restorative Flow",
            durationMinutes = 20,
            category = "beginner",
            isYoga = true,
            description = "Restorative Yin yoga asanas to unwind muscular tension before bed."
        )
    )

    private val _badges = listOf(
        BadgeItem("b1", "المبتدئ الواعي", "Conscious Starter", "أكمل جلستك الأولى", 1, true),
        BadgeItem("b2", "رائد التنفس", "Breath Pioneer", "أكمل 5 جلسات تنفس عميق", 5, true),
        BadgeItem("b3", "نجم الاستمرارية", "Consistency Star", "سلسلة أيام متتالية لمدة 7 أيام", 7, false),
        BadgeItem("b4", "سيد الهدوء", "Master of Calm", "أكمل 20 جلسة استرخاء وتأمل", 20, false),
        BadgeItem("b5", "محارب اليوغا", "Yoga Warrior", "أكمل 15 جلسة يوغا وحركة", 15, false)
    )

    fun getMeditations(): List<SessionItem> = _meditations
    fun getYogaSessions(): List<SessionItem> = _yogaSessions
    fun getAllSessions(): List<SessionItem> = _meditations + _yogaSessions
    fun getBadges(): List<BadgeItem> = _badges
}
