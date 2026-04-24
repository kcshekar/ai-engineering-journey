import math

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def neuron_forward(inputs, weights, bias):
    # Step 1: compute the weighted sum + bias
    # Hint: use zip(inputs, weights) to pair them up
    total = 0
    for i, w in zip(inputs, weights):
        total += i * w
    total += bias

    # Step 2: apply sigmoid and return
    return sigmoid(total)

# Test your function
result = neuron_forward([1.0, 0.5, -1.0], [0.4, 0.8, 0.8], 0.3)
print(f'Neuron output: {result:.4f}')  # Expected: 0.5744