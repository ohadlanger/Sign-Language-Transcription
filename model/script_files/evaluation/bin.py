import argparse
from signwriting_evaluation.metrics.similarity import SignWritingSimilarityMetric


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_path', required=True)
    parser.add_argument('--output_path', required=True)
    return parser.parse_args()


def main():
    args = get_args()
    metric = SignWritingSimilarityMetric()
    sum_score = 0

    with open(args.data_path, 'r') as file:
        # Read first line as hypothesis
        hypothesis = file.readline().strip()
        # Read second line as reference
        reference = file.readline().strip()

    reference = reference.split("A")
    hypothesis = hypothesis.split("A")
    evaluation_count = min(len(reference), len(hypothesis))
    reference = reference[:evaluation_count]
    hypothesis = hypothesis[:evaluation_count]
    for ref, hyp in zip(reference, hypothesis):
        ref = "M" + ref.split("M")[-1]
        hyp = "M" + hyp.split("M")[-1]
        sum_score += metric.score_single_sign(hyp, ref)
    final_score = sum_score / evaluation_count

    with open(args.output_path, 'w') as file:
        file.write(str(final_score))

    print('Done Successfully...')


if __name__ == "__main__":
    main()
