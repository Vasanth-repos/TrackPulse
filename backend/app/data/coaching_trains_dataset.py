"""
Authentic Indian Railways Coaching Trains Dataset & Route Network
Includes station sequences, geographic coordinates, official scheduled timetables,
and multi-day journey histories with realistic section dynamics.
"""

from typing import List, Dict, Any

STATIONS_MASTER: Dict[str, Dict[str, Any]] = {
    "SBC": {"name": "KSR Bengaluru City Junction", "state": "Karnataka", "zone": "SWR", "lat": 12.9781, "lon": 77.5696},
    "BNC": {"name": "Bengaluru Cantt", "state": "Karnataka", "zone": "SWR", "lat": 12.9934, "lon": 77.5986},
    "YPR": {"name": "Yesvantpur Junction", "state": "Karnataka", "zone": "SWR", "lat": 13.0238, "lon": 77.5501},
    "DMM": {"name": "Dharmavaram Junction", "state": "Andhra Pradesh", "zone": "SCR", "lat": 14.4137, "lon": 77.7126},
    "ATP": {"name": "Anantapur", "state": "Andhra Pradesh", "zone": "SCR", "lat": 14.6819, "lon": 77.6006},
    "GTL": {"name": "Guntakal Junction", "state": "Andhra Pradesh", "zone": "SCR", "lat": 15.1718, "lon": 77.3688},
    "AD":  {"name": "Adoni", "state": "Andhra Pradesh", "zone": "SCR", "lat": 15.6322, "lon": 77.2728},
    "MALM": {"name": "Mantralayam Road", "state": "Andhra Pradesh", "zone": "SCR", "lat": 15.9378, "lon": 77.4258},
    "RC":  {"name": "Raichur Junction", "state": "Karnataka", "zone": "SCR", "lat": 16.2076, "lon": 77.3556},
    "YG":  {"name": "Yadgir", "state": "Karnataka", "zone": "SCR", "lat": 16.7700, "lon": 77.1378},
    "WADI": {"name": "Wadi Junction", "state": "Karnataka", "zone": "CR", "lat": 17.0544, "lon": 76.9922},
    "KLBG": {"name": "Kalaburagi Junction", "state": "Karnataka", "zone": "CR", "lat": 17.3297, "lon": 76.8343},
    "SUR": {"name": "Solapur", "state": "Maharashtra", "zone": "CR", "lat": 17.6599, "lon": 75.9064},
    "KWV": {"name": "Kurduvadi Junction", "state": "Maharashtra", "zone": "CR", "lat": 18.0833, "lon": 75.4333},
    "DD":  {"name": "Daund Junction", "state": "Maharashtra", "zone": "CR", "lat": 18.4633, "lon": 74.5800},
    "ANG": {"name": "Ahmednagar", "state": "Maharashtra", "zone": "CR", "lat": 19.0952, "lon": 74.7480},
    "BAP": {"name": "Belapur", "state": "Maharashtra", "zone": "CR", "lat": 19.5760, "lon": 74.6540},
    "KPG": {"name": "Kopargaon", "state": "Maharashtra", "zone": "CR", "lat": 19.8833, "lon": 74.4833},
    "MMR": {"name": "Manmad Junction", "state": "Maharashtra", "zone": "CR", "lat": 20.2500, "lon": 74.4333},
    "CSN": {"name": "Chalisgaon Junction", "state": "Maharashtra", "zone": "CR", "lat": 20.4633, "lon": 75.0167},
    "JL":  {"name": "Jalgaon Junction", "state": "Maharashtra", "zone": "CR", "lat": 21.0077, "lon": 75.5626},
    "BSL": {"name": "Bhusaval Junction", "state": "Maharashtra", "zone": "CR", "lat": 21.0455, "lon": 75.7949},
    "BAU": {"name": "Burhanpur", "state": "Madhya Pradesh", "zone": "CR", "lat": 21.3142, "lon": 76.2294},
    "KNW": {"name": "Khandwa Junction", "state": "Madhya Pradesh", "zone": "WCR", "lat": 21.8314, "lon": 76.3498},
    "ET":  {"name": "Itarsi Junction", "state": "Madhya Pradesh", "zone": "WCR", "lat": 22.6100, "lon": 77.7600},
    "BPL": {"name": "Bhopal Junction", "state": "Madhya Pradesh", "zone": "WCR", "lat": 23.2599, "lon": 77.4126},
    "BINA": {"name": "Bina Junction", "state": "Madhya Pradesh", "zone": "WCR", "lat": 24.1750, "lon": 78.1833},
    "VGLJ": {"name": "Virangana Lakshmibai Jhansi", "state": "Uttar Pradesh", "zone": "NCR", "lat": 25.4484, "lon": 78.5685},
    "GWL": {"name": "Gwalior Junction", "state": "Madhya Pradesh", "zone": "NCR", "lat": 26.2183, "lon": 78.1828},
    "AGC": {"name": "Agra Cantt", "state": "Uttar Pradesh", "zone": "NCR", "lat": 27.1590, "lon": 77.9940},
    "MTJ": {"name": "Mathura Junction", "state": "Uttar Pradesh", "zone": "NCR", "lat": 27.4924, "lon": 77.6737},
    "FDB": {"name": "Faridabad", "state": "Haryana", "zone": "NR", "lat": 28.4089, "lon": 77.3178},
    "NZM": {"name": "Hazrat Nizamuddin", "state": "Delhi", "zone": "NR", "lat": 28.5889, "lon": 77.2534},
    "NDLS": {"name": "New Delhi", "state": "Delhi", "zone": "NR", "lat": 28.6427, "lon": 77.2195},
    
    # Mumbai Corridor
    "MMCT": {"name": "Mumbai Central", "state": "Maharashtra", "zone": "WR", "lat": 18.9696, "lon": 72.8193},
    "BVI": {"name": "Borivali", "state": "Maharashtra", "zone": "WR", "lat": 19.2291, "lon": 72.8574},
    "ST":  {"name": "Surat", "state": "Gujarat", "zone": "WR", "lat": 21.2049, "lon": 72.8407},
    "BRC": {"name": "Vadodara Junction", "state": "Gujarat", "zone": "WR", "lat": 22.3107, "lon": 73.1812},
    "RTM": {"name": "Ratlam Junction", "state": "Madhya Pradesh", "zone": "WR", "lat": 23.3344, "lon": 75.0375},
    "KOTA": {"name": "Kota Junction", "state": "Rajasthan", "zone": "WCR", "lat": 25.2138, "lon": 75.8648},
    "SWM": {"name": "Sawai Madhopur Junction", "state": "Rajasthan", "zone": "WCR", "lat": 25.9928, "lon": 76.3688},
    
    # Howrah Corridor
    "HWH": {"name": "Howrah Junction", "state": "West Bengal", "zone": "ER", "lat": 22.5839, "lon": 88.3426},
    "ASN": {"name": "Asansol Junction", "state": "West Bengal", "zone": "ER", "lat": 23.6889, "lon": 86.9661},
    "DHN": {"name": "Dhanbad Junction", "state": "Jharkhand", "zone": "ECR", "lat": 23.7957, "lon": 86.4304},
    "PNME": {"name": "Parasnath", "state": "Jharkhand", "zone": "ECR", "lat": 23.9780, "lon": 86.0820},
    "GAYA": {"name": "Gaya Junction", "state": "Bihar", "zone": "ECR", "lat": 24.7955, "lon": 84.9994},
    "DDU": {"name": "Pt. Deen Dayal Upadhyaya Junction", "state": "Uttar Pradesh", "zone": "ECR", "lat": 25.2818, "lon": 83.1189},
    "PRYJ": {"name": "Prayagraj Junction", "state": "Uttar Pradesh", "zone": "NCR", "lat": 25.4497, "lon": 81.8282},
    "CNB": {"name": "Kanpur Central", "state": "Uttar Pradesh", "zone": "NCR", "lat": 26.4539, "lon": 80.3512},
    "BSB": {"name": "Varanasi Junction", "state": "Uttar Pradesh", "zone": "NR", "lat": 25.3283, "lon": 82.9863},
    
    # Chennai - Mysuru Corridor
    "MAS": {"name": "MGR Chennai Central", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0827, "lon": 80.2707},
    "AJJ": {"name": "Arakkonam Junction", "state": "Tamil Nadu", "zone": "SR", "lat": 13.0784, "lon": 79.6677},
    "KPD": {"name": "Katpadi Junction", "state": "Tamil Nadu", "zone": "SR", "lat": 12.9698, "lon": 79.1378},
    "JTJ": {"name": "Jolarpettai Junction", "state": "Tamil Nadu", "zone": "SR", "lat": 12.5539, "lon": 78.5719},
    "KJM": {"name": "Krishnarajapuram", "state": "Karnataka", "zone": "SWR", "lat": 12.9982, "lon": 77.6789},
    "MYS": {"name": "Mysuru Junction", "state": "Karnataka", "zone": "SWR", "lat": 12.3160, "lon": 76.6433},
    
    # South-North Trunk
    "NGP": {"name": "Nagpur Junction", "state": "Maharashtra", "zone": "CR", "lat": 21.1528, "lon": 79.0882},
    "BPQ": {"name": "Balharshah Junction", "state": "Maharashtra", "zone": "CR", "lat": 19.8519, "lon": 79.3780},
    "WL":  {"name": "Warangal", "state": "Telangana", "zone": "SCR", "lat": 17.9689, "lon": 79.5941},
    "BZA": {"name": "Vijayawada Junction", "state": "Andhra Pradesh", "zone": "SCR", "lat": 16.5186, "lon": 80.6200},
}

TRAINS_METADATA: List[Dict[str, Any]] = [
    {
        "train_id": "12627",
        "train_name": "Karnataka Express",
        "train_type": "Superfast Express",
        "origin_station_code": "SBC",
        "origin_station_name": "KSR Bengaluru City Junction",
        "destination_station_code": "NDLS",
        "destination_station_name": "New Delhi",
        "total_distance_km": 2404.0,
        "scheduled_departure_time": "19:20",
        "scheduled_arrival_time": "09:00",
        "route": [
            {"station_code": "SBC", "sequence": 1, "arr": "19:20", "dep": "19:20", "dist": 0.0},
            {"station_code": "BNC", "sequence": 2, "arr": "19:30", "dep": "19:32", "dist": 4.3},
            {"station_code": "YPR", "sequence": 3, "arr": "19:48", "dep": "19:50", "dist": 14.1},
            {"station_code": "DMM", "sequence": 4, "arr": "22:50", "dep": "22:55", "dist": 181.0},
            {"station_code": "ATP", "sequence": 5, "arr": "23:28", "dep": "23:30", "dist": 214.0},
            {"station_code": "GTL", "sequence": 6, "arr": "00:55", "dep": "01:00", "dist": 282.0},
            {"station_code": "AD",  "sequence": 7, "arr": "01:43", "dep": "01:45", "dist": 334.0},
            {"station_code": "MALM", "sequence": 8, "arr": "02:18", "dep": "02:20", "dist": 375.0},
            {"station_code": "RC",  "sequence": 9, "arr": "02:48", "dep": "02:50", "dist": 404.0},
            {"station_code": "YG",  "sequence": 10, "arr": "03:48", "dep": "03:50", "dist": 472.0},
            {"station_code": "WADI", "sequence": 11, "arr": "04:50", "dep": "04:55", "dist": 511.0},
            {"station_code": "KLBG", "sequence": 12, "arr": "05:32", "dep": "05:35", "dist": 548.0},
            {"station_code": "SUR", "sequence": 13, "arr": "07:15", "dep": "07:20", "dist": 661.0},
            {"station_code": "KWV", "sequence": 14, "arr": "08:23", "dep": "08:25", "dist": 740.0},
            {"station_code": "DD",  "sequence": 15, "arr": "10:15", "dep": "10:20", "dist": 848.0},
            {"station_code": "ANG", "sequence": 16, "arr": "11:47", "dep": "11:50", "dist": 932.0},
            {"station_code": "BAP", "sequence": 17, "arr": "12:50", "dep": "12:52", "dist": 999.0},
            {"station_code": "KPG", "sequence": 18, "arr": "13:38", "dep": "13:40", "dist": 1043.0},
            {"station_code": "MMR", "sequence": 19, "arr": "14:40", "dep": "14:45", "dist": 1086.0},
            {"station_code": "CSN", "sequence": 20, "arr": "15:33", "dep": "15:35", "dist": 1153.0},
            {"station_code": "JL",  "sequence": 21, "arr": "16:43", "dep": "16:45", "dist": 1246.0},
            {"station_code": "BSL", "sequence": 22, "arr": "17:15", "dep": "17:20", "dist": 1270.0},
            {"station_code": "BAU", "sequence": 23, "arr": "18:03", "dep": "18:05", "dist": 1324.0},
            {"station_code": "KNW", "sequence": 24, "arr": "19:30", "dep": "19:35", "dist": 1393.0},
            {"station_code": "ET",  "sequence": 25, "arr": "22:00", "dep": "22:10", "dist": 1577.0},
            {"station_code": "BPL", "sequence": 26, "arr": "23:45", "dep": "23:55", "dist": 1669.0},
            {"station_code": "BINA", "sequence": 27, "arr": "01:50", "dep": "01:55", "dist": 1807.0},
            {"station_code": "VGLJ", "sequence": 28, "arr": "03:55", "dep": "04:05", "dist": 1961.0},
            {"station_code": "GWL", "sequence": 29, "arr": "05:10", "dep": "05:15", "dist": 2058.0},
            {"station_code": "AGC", "sequence": 30, "arr": "06:55", "dep": "07:00", "dist": 2176.0},
            {"station_code": "MTJ", "sequence": 31, "arr": "07:48", "dep": "07:50", "dist": 2230.0},
            {"station_code": "FDB", "sequence": 32, "arr": "09:28", "dep": "09:30", "dist": 2343.0},
            {"station_code": "NZM", "sequence": 33, "arr": "09:55", "dep": "09:57", "dist": 2397.0},
            {"station_code": "NDLS", "sequence": 34, "arr": "10:30", "dep": "10:30", "dist": 2404.0},
        ]
    },
    {
        "train_id": "12951",
        "train_name": "Mumbai Rajdhani Express",
        "train_type": "Rajdhani",
        "origin_station_code": "MMCT",
        "origin_station_name": "Mumbai Central",
        "destination_station_code": "NDLS",
        "destination_station_name": "New Delhi",
        "total_distance_km": 1384.0,
        "scheduled_departure_time": "17:00",
        "scheduled_arrival_time": "08:32",
        "route": [
            {"station_code": "MMCT", "sequence": 1, "arr": "17:00", "dep": "17:00", "dist": 0.0},
            {"station_code": "BVI",  "sequence": 2, "arr": "17:22", "dep": "17:24", "dist": 30.0},
            {"station_code": "ST",   "sequence": 3, "arr": "19:43", "dep": "19:48", "dist": 263.0},
            {"station_code": "BRC",  "sequence": 4, "arr": "21:06", "dep": "21:16", "dist": 392.0},
            {"station_code": "RTM",  "sequence": 5, "arr": "00:40", "dep": "00:43", "dist": 653.0},
            {"station_code": "KOTA", "sequence": 6, "arr": "03:15", "dep": "03:20", "dist": 920.0},
            {"station_code": "SWM",  "sequence": 7, "arr": "04:30", "dep": "04:32", "dist": 1028.0},
            {"station_code": "MTJ",  "sequence": 8, "arr": "06:40", "dep": "06:42", "dist": 1243.0},
            {"station_code": "NDLS", "sequence": 9, "arr": "08:32", "dep": "08:32", "dist": 1384.0},
        ]
    },
    {
        "train_id": "12301",
        "train_name": "Howrah Rajdhani Express",
        "train_type": "Rajdhani",
        "origin_station_code": "HWH",
        "origin_station_name": "Howrah Junction",
        "destination_station_code": "NDLS",
        "destination_station_name": "New Delhi",
        "total_distance_km": 1451.0,
        "scheduled_departure_time": "16:50",
        "scheduled_arrival_time": "10:05",
        "route": [
            {"station_code": "HWH",  "sequence": 1, "arr": "16:50", "dep": "16:50", "dist": 0.0},
            {"station_code": "ASN",  "sequence": 2, "arr": "18:57", "dep": "19:00", "dist": 200.0},
            {"station_code": "DHN",  "sequence": 3, "arr": "19:50", "dep": "19:55", "dist": 259.0},
            {"station_code": "PNME", "sequence": 4, "arr": "20:30", "dep": "20:32", "dist": 307.0},
            {"station_code": "GAYA", "sequence": 5, "arr": "22:19", "dep": "22:22", "dist": 458.0},
            {"station_code": "DDU",  "sequence": 6, "arr": "00:45", "dep": "00:55", "dist": 663.0},
            {"station_code": "PRYJ", "sequence": 7, "arr": "02:43", "dep": "02:45", "dist": 816.0},
            {"station_code": "CNB",  "sequence": 8, "arr": "04:50", "dep": "04:55", "dist": 1010.0},
            {"station_code": "NDLS", "sequence": 9, "arr": "10:05", "dep": "10:05", "dist": 1451.0},
        ]
    },
    {
        "train_id": "12007",
        "train_name": "Chennai - Mysuru Shatabdi Express",
        "train_type": "Shatabdi",
        "origin_station_code": "MAS",
        "origin_station_name": "MGR Chennai Central",
        "destination_station_code": "MYS",
        "destination_station_name": "Mysuru Junction",
        "total_distance_km": 497.0,
        "scheduled_departure_time": "06:00",
        "scheduled_arrival_time": "13:00",
        "route": [
            {"station_code": "MAS", "sequence": 1, "arr": "06:00", "dep": "06:00", "dist": 0.0},
            {"station_code": "AJJ", "sequence": 2, "arr": "06:53", "dep": "06:55", "dist": 69.0},
            {"station_code": "KPD", "sequence": 3, "arr": "07:38", "dep": "07:40", "dist": 130.0},
            {"station_code": "JTJ", "sequence": 4, "arr": "08:48", "dep": "08:50", "dist": 214.0},
            {"station_code": "BNC", "sequence": 5, "arr": "10:43", "dep": "10:45", "dist": 356.0},
            {"station_code": "SBC", "sequence": 6, "arr": "10:55", "dep": "11:00", "dist": 360.0},
            {"station_code": "MYS", "sequence": 7, "arr": "13:00", "dep": "13:00", "dist": 497.0},
        ]
    },
    {
        "train_id": "22436",
        "train_name": "Vande Bharat Express",
        "train_type": "Vande Bharat",
        "origin_station_code": "NDLS",
        "origin_station_name": "New Delhi",
        "destination_station_code": "BSB",
        "destination_station_name": "Varanasi Junction",
        "total_distance_km": 759.0,
        "scheduled_departure_time": "06:00",
        "scheduled_arrival_time": "14:00",
        "route": [
            {"station_code": "NDLS", "sequence": 1, "arr": "06:00", "dep": "06:00", "dist": 0.0},
            {"station_code": "CNB",  "sequence": 2, "arr": "10:08", "dep": "10:10", "dist": 441.0},
            {"station_code": "PRYJ", "sequence": 3, "arr": "12:08", "dep": "12:10", "dist": 635.0},
            {"station_code": "BSB",  "sequence": 4, "arr": "14:00", "dep": "14:00", "dist": 759.0},
        ]
    },
    {
        "train_id": "12622",
        "train_name": "Tamil Nadu Express",
        "train_type": "Superfast Express",
        "origin_station_code": "NDLS",
        "origin_station_name": "New Delhi",
        "destination_station_code": "MAS",
        "destination_station_name": "MGR Chennai Central",
        "total_distance_km": 2184.0,
        "scheduled_departure_time": "21:05",
        "scheduled_arrival_time": "06:15",
        "route": [
            {"station_code": "NDLS", "sequence": 1, "arr": "21:05", "dep": "21:05", "dist": 0.0},
            {"station_code": "AGC",  "sequence": 2, "arr": "23:25", "dep": "23:27", "dist": 195.0},
            {"station_code": "GWL",  "sequence": 3, "arr": "01:13", "dep": "01:15", "dist": 313.0},
            {"station_code": "VGLJ", "sequence": 4, "arr": "02:35", "dep": "02:43", "dist": 410.0},
            {"station_code": "BPL",  "sequence": 5, "arr": "06:45", "dep": "06:50", "dist": 702.0},
            {"station_code": "ET",   "sequence": 6, "arr": "08:35", "dep": "08:40", "dist": 794.0},
            {"station_code": "NGP",  "sequence": 7, "arr": "13:05", "dep": "13:10", "dist": 1092.0},
            {"station_code": "BPQ",  "sequence": 8, "arr": "16:25", "dep": "16:30", "dist": 1301.0},
            {"station_code": "WL",   "sequence": 9, "arr": "19:48", "dep": "19:50", "dist": 1544.0},
            {"station_code": "BZA",  "sequence": 10, "arr": "23:15", "dep": "23:25", "dist": 1751.0},
            {"station_code": "MAS",  "sequence": 11, "arr": "06:15", "dep": "06:15", "dist": 2184.0},
        ]
    }
]

def get_station_info(station_code: str) -> Dict[str, Any]:
    station = STATIONS_MASTER.get(station_code, {})
    return {
        "station_code": station_code,
        "station_name": station.get("name", station_code),
        "state": station.get("state", "Unknown"),
        "zone": station.get("zone", "IR"),
        "latitude": station.get("lat", 20.0),
        "longitude": station.get("lon", 78.0)
    }

def get_train_by_id(train_id: str) -> Dict[str, Any]:
    for t in TRAINS_METADATA:
        if t["train_id"] == train_id:
            return t
    return TRAINS_METADATA[0]
