# -*- coding: utf-8 -*-
"""
Created on Mon Apr 21 13:49:40 2025

@author: Thijs Vons
"""

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Sluit alle plots die open staan
plt.close('all')

# Correct inlezen van de bestanden
punten_df = pd.read_csv("score_history.csv", delimiter=",")
gebieden_df = pd.read_csv("area_history.csv", delimiter=",")
tikker_df = pd.read_csv("tikker_history.csv", delimiter=";")

# Omzetten van kolomnamen naar tijdstippen
time_columns = punten_df.columns[1:]
time_minutes = [int(t.split(':')[0]) * 60 + int(t.split(':')[1]) for t in time_columns]

# Spelers en punten extraheren
players = tikker_df.iloc[:, 0].tolist()
punten_data = punten_df.iloc[:, 1:].values.astype(int)
# punten3_data = punten3_df.iloc[:, 1:].values.astype(int)
gebieden_data = gebieden_df.iloc[:, 1:].values.astype(int)
# punten_gebieden_ratio_data = punten_data/gebieden_data
punten_gebieden_ratio_data = np.divide(punten_data, gebieden_data, out=np.full_like(punten_data, np.nan, dtype=float), where=gebieden_data != 0) # Deel aantal punten door aantal gebieden. NaN als gebieden 0 is

def set_time_axis_gap(total_time):
    if total_time <= 15:
        return 1
    elif total_time <= 60:
        return 5
    else:
        return 15

# Tikker periodes correct interpreteren
def extract_tikker_periods(tikker_df):
    periods = {player: [] for player in players}
    
    for _, row in tikker_df.iterrows():
        player = row.iloc[0]
        times = [int(t.split(':')[0]) * 60 + int(t.split(':')[1]) for t in row.iloc[1:].dropna()]
        
        for i in range(0, len(times), 2):  # Pak steeds begin- en eindtijd
            if i + 1 < len(times):
                periods[player].append((times[i], times[i + 1]))
    
    return periods

tikker_periods = extract_tikker_periods(tikker_df)

# Kleuren per speler
def assign_colors(players):
    colors = ['red', 'orange', 'beige', '#c0ffee', 'green', 'purple', 'grey']
    return {player: colors[i % len(colors)] for i, player in enumerate(players)}
colors = assign_colors(players)

# Tijdsbereik handmatig aanpassen
# start_time = 12 * 60 + 15  # 12:15 in minuten
# end_time = 16 * 60 + 30  # 16:30 in minuten
# time_minutes = [t for t in time_minutes if start_time <= t <= end_time]

# Plot functie
def plot_data(time_minutes, data, periods_dict, title, ylabel):
    fig, ax = plt.subplots(figsize=(20, 8))
    for player, data_point in zip(players, data):
        ax.plot(time_minutes, data_point, linewidth=4, label=player, color=colors[player])
        
        # Get indices where the score changes
        change_indices = set()
        for i in range(1, len(data_point)):
            if data_point[i] != data_point[i - 1]:
                change_indices.add(i)
                change_indices.add(i - 1)  # Include previous index as well
        
        # Sort indices to keep correct order
        change_indices = sorted(change_indices)
        
        # Extract corresponding times and scores
        change_times = [time_minutes[i] for i in change_indices]
        change_scores = [data_point[i] for i in change_indices]
        
        # Plot markers at those points
        ax.plot(change_times, change_scores, 'o', ms=10, color=colors[player])
    
    for player, periods in periods_dict.items():
        for start, end in periods:
            ax.axvspan(start, end, facecolor=colors[player], alpha=0.3)
    
    ax.set_title(title, fontsize=18)
    ax.set_xlabel("Tijd", fontsize=16)
    ax.set_ylabel(ylabel, fontsize=16)
    ax.legend(title="Teams", fontsize=14, title_fontsize=16)
    ax.grid(True, linestyle="--", alpha=0.7)
    
    if ylabel == "Punten/gebieden":
        ax.set_ylim(1.8,4.2)
    
    # X-as labels naar hh:mm formaat en verticale gridlijnen elke 10 minuten
    time_labels = [f"{t//60:02d}:{t%60:02d}" for t in range(time_minutes[0], time_minutes[-1] + 1, set_time_axis_gap(time_minutes[-1] - time_minutes[0]))]
    time_ticks = list(range(time_minutes[0], time_minutes[-1] + 1, set_time_axis_gap(time_minutes[-1] - time_minutes[0])))
    plt.xticks(time_ticks, time_labels, rotation=45)
    plt.grid(axis='x', linestyle='--', alpha=0.5)

    plt.savefig(f"Risky Run Eindhoven 22 februari {title}.png", dpi=300, bbox_inches='tight')
    plt.show()

# Plotten van het spelverloop van de punten
title_punten = "Puntenverloop per team"
ylabel_punten = "Punten"
plot_data(time_minutes, punten_data, tikker_periods, title_punten, ylabel_punten)

# Plotten van het spelverloop van de gebieden
title_gebieden = "Gebiedenverloop per team"
ylabel_gebieden = "Gebieden"
plot_data(time_minutes, gebieden_data, tikker_periods, title_gebieden, ylabel_gebieden)

# Plotten van het spelverloop van de punten per gebied
title_gebieden = "Punten per gebied verloop per team"
ylabel_gebieden = "Punten/gebieden"
plot_data(time_minutes, punten_gebieden_ratio_data, tikker_periods, title_gebieden, ylabel_gebieden)

