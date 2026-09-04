package com.evolum.wellness.ui.screens

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evolum.wellness.model.BreathingPhase
import com.evolum.wellness.ui.theme.AuraBackground
import com.evolum.wellness.ui.theme.AuraBorder
import com.evolum.wellness.ui.theme.AuraCard
import com.evolum.wellness.ui.theme.AuraPrimary
import com.evolum.wellness.ui.theme.AuraSurface
import com.evolum.wellness.ui.theme.AuraTextPrimary
import com.evolum.wellness.ui.theme.AuraTextSecondary

@Composable
fun BreathingScreen(
    isArabic: Boolean,
    isActive: Boolean,
    currentPhase: BreathingPhase,
    secondsLeft: Int,
    completedCycles: Int,
    onStart: () -> Unit,
    onStop: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Determine scale target for breathing circle
    val targetScale = when {
        !isActive -> 1.0f
        currentPhase == BreathingPhase.INHALE -> 1.35f
        currentPhase == BreathingPhase.HOLD -> 1.35f
        else -> 0.85f // EXHALE
    }

    val animatedScale by animateFloatAsState(
        targetValue = targetScale,
        animationSpec = tween(
            durationMillis = if (isActive) 3800 else 600,
            easing = FastOutSlowInEasing
        ),
        label = "BreathingScale"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AuraBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Titles
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = if (isArabic) "تنفس التوازن الحيوي (4-4-4)" else "Resonant Breathwork (4-4-4)",
                color = AuraPrimary,
                style = MaterialTheme.typography.titleLarge
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = if (isArabic) "مزامنة موجات الدماغ وتنظيم ضربات القلب" else "Synchronize HRV & vagal nerve tone",
                color = AuraTextSecondary,
                fontSize = 13.sp
            )
        }

        // Center Pulsing Orb
        Box(
            modifier = Modifier
                .size(280.dp),
            contentAlignment = Alignment.Center
        ) {
            // Outer glow aura
            Box(
                modifier = Modifier
                    .size(260.dp)
                    .scale(animatedScale)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                AuraPrimary.copy(alpha = if (isActive) 0.35f else 0.15f),
                                Color.Transparent
                            )
                        )
                    )
            )

            // Middle ring
            Box(
                modifier = Modifier
                    .size(200.dp)
                    .scale(animatedScale * 0.95f)
                    .clip(CircleShape)
                    .background(AuraCard)
                    .border(2.dp, AuraPrimary.copy(alpha = 0.6f), CircleShape)
            )

            // Inner center with text
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = if (!isActive) {
                        if (isArabic) "جاهز؟" else "Ready?"
                    } else {
                        if (isArabic) currentPhase.labelAr else currentPhase.labelEn
                    },
                    color = AuraPrimary,
                    style = MaterialTheme.typography.headlineMedium
                )
                if (isActive) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "$secondsLeft",
                        color = AuraTextPrimary,
                        fontSize = 32.sp,
                        style = MaterialTheme.typography.headlineLarge
                    )
                }
            }
        }

        // Bottom Stats & Controls
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = AuraSurface),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, AuraBorder, RoundedCornerShape(16.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "$completedCycles",
                            color = AuraPrimary,
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = if (isArabic) "دورات مكتملة" else "Completed Cycles",
                            color = AuraTextSecondary,
                            fontSize = 12.sp
                        )
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "${completedCycles * 12}s",
                            color = AuraTextPrimary,
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = if (isArabic) "المدة الإجمالية" else "Total Time",
                            color = AuraTextSecondary,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = { if (isActive) onStop() else onStart() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isActive) Color(0xFFEF4444) else AuraPrimary,
                    contentColor = AuraBackground
                ),
                shape = RoundedCornerShape(27.dp)
            ) {
                Icon(
                    imageVector = if (isActive) Icons.Default.Stop else Icons.Default.PlayArrow,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.size(8.dp))
                Text(
                    text = if (isActive) {
                        if (isArabic) "إيقاف الجلسة" else "Stop Session"
                    } else {
                        if (isArabic) "ابدأ تمرين التنفس" else "Start Breathing"
                    },
                    style = MaterialTheme.typography.titleMedium
                )
            }

            Spacer(modifier = Modifier.height(70.dp))
        }
    }
}
