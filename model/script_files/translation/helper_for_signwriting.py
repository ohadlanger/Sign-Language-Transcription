from math import sqrt
from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric

body_part_classes = {'hands_shapes': range(0x100, 0x205), 'facial_expressions': range(0x30A, 0x36A),
                     'head': range(0x2FF, 0x36A), 'arrow_range': range(0x221, 0x2f7)}
Class, Id, X, Y = slice(1, 4), slice(4, 6), slice(6, 9), slice(10, 13)
buffer, HEX = 7, 16


def new_distance(distance, max_distance):
    x_sign = -1 if distance[0] < 0 else 1
    y_sign = -1 if distance[1] < 0 else 1
    x_delta = sqrt((x_sign * distance[0]) / max_distance) * max_distance
    y_delta = sqrt((y_sign * distance[1]) / max_distance) * max_distance
    return x_sign * x_delta, y_sign * y_delta


def normalize_by_face(symbols):
    face = next((symbol for symbol in symbols if int(symbol[Class], HEX) in body_part_classes['head']), None)
    if not face:
        return symbols
    expanded = [symbols.pop(0), face]
    symbols = [symbol for symbol in symbols if int(symbol[Class], HEX) not in body_part_classes['head']]
    face_coord = [int(face[X]), int(face[Y])]

    distances = [(symbol, [int(symbol[X]) - face_coord[0], int(symbol[Y]) - face_coord[1]]) for symbol in symbols]
    max_dist = max(map(abs, max(distances, key=lambda x: max(map(abs, x[1])))[1]))

    new_distances = [new_distance(item[1], max_dist) for item in distances]
    formatted = [(f'S{item[0][Class]}{item[0][Id]}{str(face_coord[0] + int(new_dist[0]))}x'
                  f'{face_coord[1] + int(new_dist[1])}') for new_dist, item in zip(new_distances, distances)]

    return expanded + formatted


def normalize_by_neighbours(symbols):
    similarity_metric = SignWritingSimilarityMetric()
    all_body_part_classes = set().union(*body_part_classes.values())
    final_lst = [symbols.pop(0)]
    coordinates = [tuple(int(pos) for pos in symbols[i][6:].split('x')) for i in range(len(symbols))]

    for i in range(len(symbols)):
        body_symbol_class = int(symbols[i][Class], HEX)
        x, y = coordinates[i]
        for j in range(1, len(final_lst)):
            x2, y2 = coordinates[j - 1]
            if abs(x - x2) < buffer and abs(y - y2) < buffer:
                x = x2 + 2 * (buffer - 1)
                coordinates[i] = (x, y)

        new_symbol = f'S{symbols[i][Class]}{symbols[i][Id]}{x}x{y}'
        if body_symbol_class not in all_body_part_classes:
            final_lst.append(new_symbol)
            continue
        max_similarity = max([similarity_metric.score_all([new_symbol], [final_lst[j]])[0][0]
                              for j in range(len(final_lst))])
        if max_similarity < 0.9:
            final_lst.append(new_symbol)
    return final_lst
