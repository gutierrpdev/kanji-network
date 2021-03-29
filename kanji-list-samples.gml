graph [
	directed 0
	node [
		id 明
		label "明"
		taughtIn "grade 2"
		newspaperFrequencyRank 67
		meaning "bright, light"
		strokeCount 8
		jlptLevel "N4"
	]
	node [
		id 時
		label "時"
		taughtIn "grade 2"
		newspaperFrequencyRank 16
		meaning "time, hour"
		strokeCount 10
		jlptLevel "N5"
	]
	node [
		id 日
		label "日"
		taughtIn "grade 1"
		newspaperFrequencyRank 1
		meaning "day, sun, Japan, counter for days"
		strokeCount 4
		jlptLevel "N5"
	]
	node [
		id 月
		label "月"
		taughtIn "grade 1"
		newspaperFrequencyRank 23
		meaning "month, moon"
		strokeCount 4
		jlptLevel "N5"
	]
	node [
		id 寺
		label "寺"
		taughtIn "grade 2"
		newspaperFrequencyRank 879
		meaning "Buddhist temple"
		strokeCount 6
		jlptLevel "N2"
	]
	node [
		id 待
		label "待"
		taughtIn "grade 3"
		newspaperFrequencyRank 391
		meaning "wait, depend on"
		strokeCount 9
		jlptLevel "N4"
	]
	node [
		id 曜
		label "曜"
		taughtIn "grade 2"
		newspaperFrequencyRank 940
		meaning "weekday"
		strokeCount 18
		jlptLevel "N4"
	]
	edge [
		source 明
		target 時
		value 1
		sharedParts "日"
	]
	edge [
		source 日
		target 明
		value 1
		sharedParts "日"
	]
	edge [
		source 明
		target 曜
		value 1
		sharedParts "日"
	]
	edge [
		source 日
		target 時
		value 1
		sharedParts "日"
	]
	edge [
		source 時
		target 曜
		value 1
		sharedParts "日"
	]
	edge [
		source 日
		target 曜
		value 1
		sharedParts "日"
	]
	edge [
		source 明
		target 月
		value 1
		sharedParts "月"
	]
	edge [
		source 寺
		target 時
		value 2
		sharedParts "土,寸"
	]
	edge [
		source 待
		target 時
		value 2
		sharedParts "土,寸"
	]
	edge [
		source 寺
		target 待
		value 2
		sharedParts "土,寸"
	]
]
