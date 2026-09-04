package com.evolum.wellness.ui.screens

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.NightsStay
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Timeline
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evolum.wellness.model.AuraMetrics
import com.evolum.wellness.ui.theme.AuraBackground
import com.evolum.wellness.ui.theme.AuraBorder
import com.evolum.wellness.ui.theme.AuraCard
import com.evolum.wellness.ui.theme.AuraPrimary
import com.evolum.wellness.ui.theme.AuraSurface
import com.evolum.wellness.ui.theme.AuraTextPrimary
import com.evolum.wellness.ui.theme.AuraTextSecondary

@Composable
fun LongevityScreen(
    isArabic: Boolean,
    metrics: AuraMetrics,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(AuraBackground)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = if (isArabic) "مؤشرات طول العمر والحيوية الأيضية" else "Longevity & Metabolic Biomarkers",
                color = AuraPrimary,
                style = MaterialTheme.typography.headlineMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = if (isArabic) "تتبع العمر البيولوجي وسرعة الشيخوخة ونشاط القلب" else "Track biological age, aging rate, and restorative physiology",
                color = AuraTextSecondary,
                fontSize = 13.sp
            )
        }

        // Hero Longevity Card
        item {
            Card(
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = AuraCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, AuraPrimary.copy(alpha = 0.5f), RoundedCornerShape(22.dp))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = if (isArabic) "العمر البيولوجي المقدر" else "Calculated Biological Age",
                        color = AuraTextSecondary,
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        verticalAlignment = Alignment.Bottom,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${metrics.auraAge}",
                                color = AuraPrimary,
                                fontSize = 48.sp,
                                style = MaterialTheme.typography.headlineLarge
                            )
                            Text(
                                text = if (isArabic) " سنة" else " yrs",
                                color = AuraTextPrimary,
                                fontSize = 18.sp,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                        }
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF064E3B))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "-${metrics.chronologicalAge - metrics.auraAge} ${if (isArabic) "سنوات شباب" else "years younger"}",
                                color = Color(0xFF34D399),
                                fontSize = 12.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = if (isArabic) "عمرك الزمني: ${metrics.chronologicalAge} سنة | وتيرة الشيخوخة: ${metrics.paceOfAging}x سنوياً"
                        else "Chronological: ${metrics.chronologicalAge} yrs | Pace of aging: ${metrics.paceOfAging}x/yr",
                        color = AuraTextSecondary,
                        fontSize = 12.sp
                    )
                }
            }
        }

        // 4 Biometrics Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                BiometricCard(
                    title = if (isArabic) "نبض الراحة" else "Resting HR",
                    value = "${metrics.heartRate} bpm",
                    status = if (isArabic) "ممتاز" else "Optimal",
                    icon = Icons.Default.Favorite,
                    modifier = Modifier.weight(1f)
                )
                BiometricCard(
                    title = if (isArabic) "وتيرة الشيخوخة" else "Aging Pace",
                    value = "${metrics.paceOfAging}x",
                    status = if (isArabic) "متباطئة (-12%)" else "Slowed (-12%)",
                    icon = Icons.Default.Speed,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                BiometricCard(
                    title = if (isArabic) "معدل تقلب النبض" else "HRV Index",
                    value = "68 ms",
                    status = if (isArabic) "تعافي مرتفع" else "High Recovery",
                    icon = Icons.Default.Timeline,
                    modifier = Modifier.weight(1f)
                )
                BiometricCard(
                    title = if (isArabic) "نوم ترميم الخلايا" else "Cellular Sleep",
                    value = "2h 15m",
                    status = if (isArabic) "نوم عميق" else "Deep Stage",
                    icon = Icons.Default.NightsStay,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Recommendations Card
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = AuraSurface),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, AuraBorder, RoundedCornerShape(18.dp))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = if (isArabic) "بروتوكول اليوم لطول العمر" else "Today's Longevity Protocol",
                        color = AuraPrimary,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = if (isArabic)
                            "• 15 دقيقة يوغا لتحسين مرونة الشرايين وتصريف السوائل اللمفاوية\n• 5 دقائق تنفس رنان لخفض ضغط الدم الموضعي\n• الامتناع عن الشاشات الزرقاء قبل 45 دقيقة من النوم"
                        else
                            "• 15 min morning yoga flow for arterial elasticity & lymph drainage\n• 5 min resonant breathwork for autonomic vagal balance\n• Digital blue light sunset 45 mins before sleep",
                        color = AuraTextPrimary,
                        fontSize = 13.sp,
                        lineHeight = 22.sp
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}

@Composable
fun BiometricCard(
    title: String,
    value: String,
    status: String,
    icon: ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = AuraCard),
        modifier = modifier.border(1.dp, AuraBorder, RoundedCornerShape(16.dp))
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(AuraSurface),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = AuraPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(text = title, color = AuraTextSecondary, fontSize = 12.sp)
            Text(text = value, color = AuraTextPrimary, style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = status, color = Color(0xFF34D399), fontSize = 11.sp)
        }
    }
}
