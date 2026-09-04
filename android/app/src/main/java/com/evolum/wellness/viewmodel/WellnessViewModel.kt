package com.evolum.wellness.viewmodel

import android.app.Application
import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.evolum.wellness.data.SessionRepository
import com.evolum.wellness.model.AICoachMessage
import com.evolum.wellness.model.AuraMetrics
import com.evolum.wellness.model.BreathingPhase
import com.evolum.wellness.model.SessionItem
import com.evolum.wellness.model.UserProgress
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class WellnessViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = SessionRepository()

    // Active Tab
    private val _currentTab = MutableStateFlow("home")
    val currentTab: StateFlow<String> = _currentTab.asStateFlow()

    // Language: "ar" or "en"
    private val _language = MutableStateFlow("ar")
    val language: StateFlow<String> = _language.asStateFlow()

    // Data lists
    val meditations = repository.getMeditations()
    val yogaSessions = repository.getYogaSessions()
    val badges = repository.getBadges()

    // Active Player Session
    private val _activeSession = MutableStateFlow<SessionItem?>(null)
    val activeSession: StateFlow<SessionItem?> = _activeSession.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _playbackProgress = MutableStateFlow(0f)
    val playbackProgress: StateFlow<Float> = _playbackProgress.asStateFlow()

    // Longevity Metrics
    private val _metrics = MutableStateFlow(AuraMetrics())
    val metrics: StateFlow<AuraMetrics> = _metrics.asStateFlow()

    // User Progress
    private val _progress = MutableStateFlow(UserProgress())
    val progress: StateFlow<UserProgress> = _progress.asStateFlow()

    // Breathing Timer State
    private val _isBreathingActive = MutableStateFlow(false)
    val isBreathingActive: StateFlow<Boolean> = _isBreathingActive.asStateFlow()

    private val _currentBreathingPhase = MutableStateFlow(BreathingPhase.INHALE)
    val currentBreathingPhase: StateFlow<BreathingPhase> = _currentBreathingPhase.asStateFlow()

    private val _phaseSecondsLeft = MutableStateFlow(4)
    val phaseSecondsLeft: StateFlow<Int> = _phaseSecondsLeft.asStateFlow()

    private val _completedCycles = MutableStateFlow(0)
    val completedCycles: StateFlow<Int> = _completedCycles.asStateFlow()

    private var breathingJob: Job? = null

    // AI Coach Chat
    private val _aiMessages = MutableStateFlow<List<AICoachMessage>>(
        listOf(
            AICoachMessage(
                id = "m0",
                isUser = false,
                text = "أهلاً بك! أنا مرشدك الصحي بالذكاء الاصطناعي. كيف تشعر اليوم وما هي أهدافك للسكينة والحيوية؟"
            )
        )
    )
    val aiMessages: StateFlow<List<AICoachMessage>> = _aiMessages.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading: StateFlow<Boolean> = _isAiLoading.asStateFlow()

    // Vibrator for Android Haptic feedback
    private val vibrator: Vibrator? by lazy {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = application.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            application.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    }

    fun setTab(tab: String) {
        _currentTab.value = tab
    }

    fun toggleLanguage() {
        _language.value = if (_language.value == "ar") "en" else "ar"
    }

    fun openSession(session: SessionItem) {
        _activeSession.value = session
        _isPlaying.value = true
        _playbackProgress.value = 0f
    }

    fun closePlayer() {
        _activeSession.value = null
        _isPlaying.value = false
    }

    fun togglePlayPause() {
        _isPlaying.value = !_isPlaying.value
    }

    fun updatePlaybackProgress(progress: Float) {
        _playbackProgress.value = progress.coerceIn(0f, 1f)
    }

    // Breathing logic with gentle vibration on phase change
    fun startBreathing() {
        _isBreathingActive.value = true
        _currentBreathingPhase.value = BreathingPhase.INHALE
        _phaseSecondsLeft.value = 4
        triggerHaptic(60)

        breathingJob?.cancel()
        breathingJob = viewModelScope.launch {
            while (_isBreathingActive.value) {
                for (sec in 4 downTo 1) {
                    _phaseSecondsLeft.value = sec
                    delay(1000)
                }

                when (_currentBreathingPhase.value) {
                    BreathingPhase.INHALE -> {
                        _currentBreathingPhase.value = BreathingPhase.HOLD
                        triggerHaptic(40)
                    }
                    BreathingPhase.HOLD -> {
                        _currentBreathingPhase.value = BreathingPhase.EXHALE
                        triggerHaptic(80)
                    }
                    BreathingPhase.EXHALE -> {
                        _currentBreathingPhase.value = BreathingPhase.INHALE
                        _completedCycles.value += 1
                        _progress.value = _progress.value.copy(
                            breathingCyclesCompleted = _progress.value.breathingCyclesCompleted + 1
                        )
                        triggerHaptic(100)
                    }
                }
            }
        }
    }

    fun stopBreathing() {
        _isBreathingActive.value = false
        breathingJob?.cancel()
        breathingJob = null
    }

    private fun triggerHaptic(durationMs: Long) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(durationMs)
            }
        } catch (_: Exception) {}
    }

    // AI Coach Interaction
    fun sendAiPrompt(userInput: String) {
        if (userInput.isBlank()) return

        val userMsg = AICoachMessage(id = System.currentTimeMillis().toString(), isUser = true, text = userInput)
        _aiMessages.value = _aiMessages.value + userMsg

        _isAiLoading.value = true
        viewModelScope.launch {
            delay(1200) // Simulated generative AI inference or call to backend
            val botResponse = if (_language.value == "ar") {
                "بناءً على شعورك بالتوتر، يُنصح بجلسة تنفس الحجاب الحاجز 4-4-4 لمدة 5 دقائق لخفض إفراز الكورتيزول وتنشيط الجهاز العصبي اللاودي."
            } else {
                "Based on your input, a 5-minute 4-4-4 resonant breathwork session will activate your parasympathetic system and restore clarity."
            }
            _aiMessages.value = _aiMessages.value + AICoachMessage(
                id = (System.currentTimeMillis() + 1).toString(),
                isUser = false,
                text = botResponse
            )
            _isAiLoading.value = false
        }
    }
}
