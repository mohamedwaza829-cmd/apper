package com.evolum.wellness.ui.screens

import android.content.Intent
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.evolum.wellness.model.BadgeItem
import com.evolum.wellness.model.UserProgress
import com.evolum.wellness.ui.theme.AuraBackground
import com.evolum.wellness.ui.theme.AuraBorder
import com.evolum.wellness.ui.theme.AuraCard
import com.evolum.wellness.ui.theme.AuraPrimary
import com.evolum.wellness.ui.theme.AuraSurface
import com.evolum.wellness.ui.theme.AuraTextPrimary
import com.evolum.wellness.ui.theme.AuraTextSecondary

@Composable
fun ProgressScreen(
    isArabic: Boolean,
    progress: UserProgress,
    badges: List<BadgeItem>,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

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
                text = if (isArabic) "رحلة التقدم والإنجازات" else "Progress & Milestones",
                color = AuraPrimary,
                style = MaterialTheme.typography.headlineMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = if (isArabic) "متابعة ساعات التأمل والنشاط وشارات التميز" else "Track session consistency, practice hours, and honors",
                color = AuraTextSecondary,
                fontSize = 13.sp
            )
        }

        // Summary 3-stats Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StatCard(
                    number = "${progress.streak}",
                    label = if (isArabic) "أيام متتالية" else "Day Streak",
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    number = "${progress.sessionsCompleted}",
                    label = if (isArabic) "جلسة مكتملة" else "Completed",
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    number = "${progress.minutesMeditated}",
                    label = if (isArabic) "دقيقة تأمل" else "Minutes",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Weekly Activity Bars
        item {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = AuraCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, AuraBorder, RoundedCornerShape(18.dp))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = if (isArabic) "نشاط الأسبوع الحالي" else "Weekly Practice Minutes",
                        color = AuraTextPrimary,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(18.dp))
                    val days = if (isArabic) listOf("س", "أ", "ن", "ث", "ع", "خ", "ج") else listOf("S", "M", "T", "W", "T", "F", "S")
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        progress.weeklyActivity.forEachIndexed { index, mins ->
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .width(28.dp)
                                        .height((mins * 2.2f).coerceIn(12f, 90f).dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(if (mins > 0) AuraPrimary else AuraSurface)
                                        .border(1.dp, AuraBorder, RoundedCornerShape(8.dp))
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = days[index % days.size],
                                    color = AuraTextSecondary,
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        // Share Milestones Button using Android Intent
        item {
            Button(
                onClick = {
                    val sendIntent = Intent().apply {
                        action = Intent.ACTION_SEND
                        putExtra(
                            Intent.EXTRA_TEXT,
                            "أكملت ${progress.sessionsCompleted} جلسة تأمل مع Evolum وسلسلة ${progress.streak} أيام من الحيوية واليقظة! 🌟"
                        )
                        type = "text/plain"
                    }
                    val shareIntent = Intent.createChooser(sendIntent, null)
                    context.startActivity(shareIntent)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AuraCard),
                shape = RoundedCornerShape(25.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, AuraBorder)
            ) {
                Icon(
                    imageVector = Icons.Default.Share,
                    contentDescription = null,
                    tint = AuraPrimary,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isArabic) "مشاركة الإنجاز" else "Share Progress",
                    color = AuraTextPrimary,
                    fontSize = 14.sp
                )
            }
        }

        // Badges Section
        item {
            Text(
                text = if (isArabic) "شارات الإنجاز والجوائز" else "Badges & Achievements",
                color = AuraTextPrimary,
                style = MaterialTheme.typography.titleMedium
            )
        }

        items(badges) { badge ->
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = AuraCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        1.dp,
                        if (badge.isUnlocked) AuraPrimary.copy(alpha = 0.4f) else AuraBorder,
                        RoundedCornerShape(16.dp)
                    )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(if (badge.isUnlocked) AuraPrimary.copy(alpha = 0.2f) else AuraSurface),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (badge.isUnlocked) Icons.Default.EmojiEvents else Icons.Default.Lock,
                            contentDescription = null,
                            tint = if (badge.isUnlocked) AuraPrimary else AuraTextSecondary,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isArabic) badge.title else badge.titleEn,
                            color = AuraTextPrimary,
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = badge.description,
                            color = AuraTextSecondary,
                            fontSize = 12.sp
                        )
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (badge.isUnlocked) AuraPrimary else AuraSurface)
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = if (badge.isUnlocked) {
                                if (isArabic) "مفتوحة" else "Unlocked"
                            } else {
                                if (isArabic) "مقفلة" else "Locked"
                            },
                            color = if (badge.isUnlocked) AuraBackground else AuraTextSecondary,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}

@Composable
fun StatCard(number: String, label: String, modifier: Modifier = Modifier) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = AuraCard),
        modifier = modifier.border(1.dp, AuraBorder, RoundedCornerShape(16.dp))
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = number, color = AuraPrimary, style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = label, color = AuraTextSecondary, fontSize = 11.sp, maxLines = 1)
        }
    }
}
