package com.evolum.wellness.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.SelfImprovement
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.evolum.wellness.ui.theme.AuraBorder
import com.evolum.wellness.ui.theme.AuraCard
import com.evolum.wellness.ui.theme.AuraPrimary
import com.evolum.wellness.ui.theme.AuraSurface
import com.evolum.wellness.ui.theme.AuraTextPrimary
import com.evolum.wellness.ui.theme.AuraTextSecondary

sealed class NavDestination(val route: String, val labelEn: String, val labelAr: String, val icon: ImageVector) {
    object Home : NavDestination("home", "Home", "الرئيسية", Icons.Default.Home)
    object Meditation : NavDestination("meditation", "Meditation", "التأمل", Icons.Default.SelfImprovement)
    object Breathing : NavDestination("breathing", "Breathing", "التنفس", Icons.Default.Spa)
    object Longevity : NavDestination("longevity", "Vitality", "الحيوية", Icons.Default.Favorite)
    object AICoach : NavDestination("ai_coach", "AI Coach", "المرشد", Icons.Default.AutoAwesome)
    object Progress : NavDestination("progress", "Progress", "التقدم", Icons.Default.BarChart)
}

@Composable
fun AuraBottomNav(
    currentTab: String,
    isArabic: Boolean,
    onTabSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        NavDestination.Home,
        NavDestination.Meditation,
        NavDestination.Breathing,
        NavDestination.Longevity,
        NavDestination.AICoach,
        NavDestination.Progress
    )

    NavigationBar(
        modifier = modifier
            .fillMaxWidth()
            .background(AuraSurface),
        containerColor = AuraSurface,
        tonalElevation = androidx.compose.ui.unit.Dp(0f)
    ) {
        items.forEach { dest ->
            val isSelected = currentTab == dest.route
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(dest.route) },
                icon = {
                    Icon(
                        imageVector = dest.icon,
                        contentDescription = if (isArabic) dest.labelAr else dest.labelEn
                    )
                },
                label = {
                    Text(
                        text = if (isArabic) dest.labelAr else dest.labelEn,
                        maxLines = 1
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = AuraPrimary,
                    selectedTextColor = AuraPrimary,
                    unselectedIconColor = AuraTextSecondary,
                    unselectedTextColor = AuraTextSecondary,
                    indicatorColor = AuraCard
                )
            )
        }
    }
}
