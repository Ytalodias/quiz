import React from 'react'
import { BarChart3, Target, Clock, Zap } from 'lucide-react'
import { user } from '../pages/User'

const UserStatus = ({ user, recentResults = [] }) => {
    const accuracyRate = user.quizzesPlayed > 0 ? (user.totalScore / (user.quizzesPlayed * 100)) * 100 : 0;
    const averageScore = user.quizzesPlayed > 0 ? user.totalScore / user.quizzesPlayed : 0;

    const stats = [
        {
            label: 'Pontuação Total',
            value: user.totalScore.toLocaleString(),
            icon: Target,
            color: 'from-blue-500 to-blue-600',
        },
        {
            label: 'Quizzes Jogados',
            value: user.quizzesPlayed.toString(),
            icon: BarChart3,
            color: 'from-green-500 to-green-600',
        },
        {
            label: 'Pontuação Média',
            value: averageScore.toFixed(0),
            icon: Zap,
            color: 'from-Purple-500 to-Purple-600',
        },
        {
            label: 'Taxa de Acerto',
            value: `${accuracyRate.toFixed(1)}%`,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
        },
    ];
}