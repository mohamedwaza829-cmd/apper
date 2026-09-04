package com.evolum.wellness.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evolum.wellness.model.AuraMetrics
import com.evolum.wellness.model.SessionItem
import com.evolum.wellness.model.UserProgress
import com.evolum.wellness.ui.theme.AuraBackground
import com.evolum.wellness.ui.theme.AuraBorder
import com.evolum.wellness.ui.theme.AuraCard
import com.evolum.wellness.ui.theme.AuraPrimary
import com.evolum.wellness.ui.theme.AuraSurface
import com.evolum.wellness.ui.theme.AuraTextPrimary
import com.evolum.wellness.ui.theme.AuraTextSecondary

@Composable
fun HomeScreen(
    isArabic: Boolean,
    metrics: AuraMetrics,
    progress: UserProgress,
    meditations: List<SessionItem>,
    yogaSessions: List<SessionItem>,
    onSelectSession: (SessionItem) -> Unit,
    onStartBreathing: () -> Unit,
    onToggleLanguage: () -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(AuraBackground)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(8.dp))
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (isArabic) "مرحباً بعودتك" else "Welcome back",
                        color = AuraTextSecondary,
                        fontSize = 14.sp
                    )
                    Text(
                        text = if (isArabic) "الحيوية واليقظة" else "Vitality & Calm",
                        color = AuraTextPrimary,
                        style = MaterialTheme.typography.headlineMedium
                    )
                }
                IconButton(
                    onClick = onToggleLanguage,
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(AuraCard)
                        .border(1.dp, AuraBorder, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Translate,
                        contentDescription = "Language",
                        tint = AuraPrimary
                    )
                }
            }
        }

        // Longevity / Biometric Quick Card
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = AuraCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, AuraBorder, RoundedCornerShape(20.dp))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isArabic) "مؤشر الحيوية والعمر الأيضي" else "Vitality Longevity Index",
                            color = AuraTextSecondary,
                            fontSize = 12.sp
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${metrics.auraAge}",
                                color = AuraPrimary,
                                fontSize = 32.sp,
                                style = MaterialTheme.typography.headlineLarge
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isArabic) "سنة بيولوجية (-4)" else "Bio-years (-4)",
                                color = Color(0xFF34D399),
                                fontSize = 13.sp,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(AuraSurface)
                            .border(1.dp, AuraBorder, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${progress.streak}d",
                            color = AuraPrimary,
                            style = MaterialTheme.typography.titleMedium
                        )
                    }
                }
            }
        }

        // Quick Breathing Action Hero
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onStartBreathing() }
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.horizontalGradient(
                                colors = listOf(Color(0xFF2E2A14), Color(0xFF181818))
                            ),
                            shape = RoundedCornerShape(20.dp)
                        )
                        .border(1.dp, AuraPrimary.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                        .padding(20.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (isArabic) "تمرين التنفس الرنان (4-4-4)" else "Resonant Breathing (4-4-4)",
                                color = AuraPrimary,
                                style = MaterialTheme.typography.titleMedium
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = if (isArabic) "أعد ضبط نبضك واستعد التوازن في 3 دقائق" else "Reset autonomic balance in 3 minutes",
                                color = AuraTextSecondary,
                                fontSize = 13.sp
                            )
                        }
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(AuraPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Spa,
                                contentDescription = "Start",
                                tint = AuraBackground
                            )
                        }
                    }
                }
            }
        }

        // Meditation section
        item {
            Text(
                text = if (isArabic) "جلسات التأمل الموصى بها" else "Recommended Meditations",
                color = AuraTextPrimary,
                style = MaterialTheme.typography.titleMedium
            )
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                items(meditations) { item ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = AuraCard),
                        modifier = Modifier
                            .width(220.dp)
                            .border(1.dp, AuraBorder, RoundedCornerShape(16.dp))
                            .clickable { onSelectSession(item) }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = "${item.durationMinutes} ${if (isArabic) "د" else "min"}",
                                    color = AuraPrimary,
                                    fontSize = 12.sp
                                )
                                Box(
                                    modifier = Modifier
                                        .size(28.dp)
                                        .clip(CircleShape)
                                        .background(AuraSurface),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.PlayArrow,
                                        contentDescription = "Play",
                                        tint = AuraTextPrimary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(18.dp))
                            Text(
                                text = if (isArabic) item.title else item.titleEn,
                                color = AuraTextPrimary,
                                style = MaterialTheme.typography.titleMedium,
                                maxLines = 2
                            )
                        }
                    }
                }
            }
        }

        // Yoga section
        item {
            Text(
                text = if (isArabic) "حركات اليوغا وتدفق الطاقة" else "Yoga & Movement Flows",
                color = AuraTextPrimary,
                style = MaterialTheme.typography.titleMedium
            )
        }

        items(yogaSessions) { yoga ->
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = AuraCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, AuraBorder, RoundedCornerShape(16.dp))
                    .clickable { onSelectSession(yoga) }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isArabic) yoga.title else yoga.titleEn,
                            color = AuraTextPrimary,
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${yoga.durationMinutes} ${if (isArabic) "دقيقة" else "min"} • ${yoga.category.replaceFirstChar { it.uppercase() }}",
                            color = AuraTextSecondary,
                            fontSize = 12.sp
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = "Open",
                        tint = AuraPrimary
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}
