package com.evolum.wellness

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.evolum.wellness.ui.components.AuraBottomNav
import com.evolum.wellness.ui.screens.AICoachScreen
import com.evolum.wellness.ui.screens.BreathingScreen
import com.evolum.wellness.ui.screens.HomeScreen
import com.evolum.wellness.ui.screens.LongevityScreen
import com.evolum.wellness.ui.screens.PlayerScreen
import com.evolum.wellness.ui.screens.ProgressScreen
import com.evolum.wellness.ui.theme.AuraBackground
import com.evolum.wellness.ui.theme.EvolumWellnessTheme
import com.evolum.wellness.viewmodel.WellnessViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: WellnessViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val language by viewModel.language.collectAsState()
            val isArabic = language == "ar"

            CompositionLocalProvider(
                LocalLayoutDirection provides if (isArabic) LayoutDirection.Rtl else LayoutDirection.Ltr
            ) {
                EvolumWellnessTheme {
                    MainAppContent(viewModel = viewModel, isArabic = isArabic)
                }
            }
        }
    }
}

@Composable
fun MainAppContent(
    viewModel: WellnessViewModel,
    isArabic: Boolean
) {
    val currentTab by viewModel.currentTab.collectAsState()
    val activeSession by viewModel.activeSession.collectAsState()
    val isPlaying by viewModel.isPlaying.collectAsState()
    val playbackProgress by viewModel.playbackProgress.collectAsState()

    val metrics by viewModel.metrics.collectAsState()
    val progress by viewModel.progress.collectAsState()

    val isBreathingActive by viewModel.isBreathingActive.collectAsState()
    val currentBreathingPhase by viewModel.currentBreathingPhase.collectAsState()
    val phaseSecondsLeft by viewModel.phaseSecondsLeft.collectAsState()
    val completedCycles by viewModel.completedCycles.collectAsState()

    val aiMessages by viewModel.aiMessages.collectAsState()
    val isAiLoading by viewModel.isAiLoading.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        Scaffold(
            containerColor = AuraBackground,
            bottomBar = {
                AuraBottomNav(
                    currentTab = currentTab,
                    isArabic = isArabic,
                    onTabSelected = { viewModel.setTab(it) }
                )
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                when (currentTab) {
                    "home" -> HomeScreen(
                        isArabic = isArabic,
                        metrics = metrics,
                        progress = progress,
                        meditations = viewModel.meditations,
                        yogaSessions = viewModel.yogaSessions,
                        onSelectSession = { viewModel.openSession(it) },
                        onStartBreathing = { viewModel.setTab("breathing") },
                        onToggleLanguage = { viewModel.toggleLanguage() }
                    )
                    "meditation" -> HomeScreen(
                        isArabic = isArabic,
                        metrics = metrics,
                        progress = progress,
                        meditations = viewModel.meditations,
                        yogaSessions = viewModel.yogaSessions,
                        onSelectSession = { viewModel.openSession(it) },
                        onStartBreathing = { viewModel.setTab("breathing") },
                        onToggleLanguage = { viewModel.toggleLanguage() }
                    )
                    "breathing" -> BreathingScreen(
                        isArabic = isArabic,
                        isActive = isBreathingActive,
                        currentPhase = currentBreathingPhase,
                        secondsLeft = phaseSecondsLeft,
                        completedCycles = completedCycles,
                        onStart = { viewModel.startBreathing() },
                        onStop = { viewModel.stopBreathing() }
                    )
                    "longevity" -> LongevityScreen(
                        isArabic = isArabic,
                        metrics = metrics
                    )
                    "ai_coach" -> AICoachScreen(
                        isArabic = isArabic,
                        messages = aiMessages,
                        isLoading = isAiLoading,
                        onSendMessage = { viewModel.sendAiPrompt(it) }
                    )
                    "progress" -> ProgressScreen(
                        isArabic = isArabic,
                        progress = progress,
                        badges = viewModel.badges
                    )
                }
            }
        }

        // Fullscreen player overlay if a session is currently opened
        activeSession?.let { session ->
            PlayerScreen(
                session = session,
                isArabic = isArabic,
                isPlaying = isPlaying,
                playbackProgress = playbackProgress,
                onTogglePlayPause = { viewModel.togglePlayPause() },
                onSeek = { viewModel.updatePlaybackProgress(it) },
                onClose = { viewModel.closePlayer() }
            )
        }
    }
}
