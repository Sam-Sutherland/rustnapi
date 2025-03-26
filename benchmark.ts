import { add as rustAdd, fibonacci as rustFib, matrixMultiply as rustMatrix } from './jarvis.node';

function jsAdd(a: number, b: number): number {
    return a + b;
}

function jsFib(n: number): number {
    if (n <= 1) return n;
    return jsFib(n - 1) + jsFib(n - 2);
}

function jsMatrixMultiply(size: number): number {
    const n = size;
    const a = Array(n).fill(0).map(() => Array(n).fill(1));
    const b = Array(n).fill(0).map(() => Array(n).fill(2));
    const c = Array(n).fill(0).map(() => Array(n).fill(0));

    // Matrix multiplication
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    // Sum all elements (to prevent compiler optimization)
    return c.flat().reduce((a, b) => a + b, 0);
}

// Benchmark function for binary operations (like add)
function benchmarkBinary(name: string, fn: (a: number, b: number) => number, iterations: number) {
    const start = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
        fn(i, i + 1);
    }
    
    const end = process.hrtime.bigint();
    const timeMs = Number(end - start) / 1_000_000; // Convert to milliseconds
    console.log(`${name}: ${timeMs.toFixed(2)}ms`);
    return timeMs;
}

// Benchmark function for unary operations (like fibonacci and matrix)
function benchmarkUnary(name: string, fn: (n: number) => number | bigint, input: number, iterations: number) {
    const start = process.hrtime.bigint();
    
    for (let i = 0; i < iterations; i++) {
        fn(input);
    }
    
    const end = process.hrtime.bigint();
    const timeMs = Number(end - start) / 1_000_000; // Convert to milliseconds
    console.log(`${name}: ${timeMs.toFixed(2)}ms`);
    return timeMs;
}

// Run benchmarks
console.log('# Benchmark Results\n');

console.log('## Simple Addition Benchmark');
const ADD_ITERATIONS = 10_000_000;
console.log(`Running ${ADD_ITERATIONS.toLocaleString()} iterations...\n`);

// Warm up
benchmarkBinary('Warmup JS Add', jsAdd, 1000);
benchmarkBinary('Warmup Rust Add', rustAdd, 1000);

// Addition benchmarks
const jsAddTime = benchmarkBinary('JavaScript Add', jsAdd, ADD_ITERATIONS);
const rustAddTime = benchmarkBinary('Rust Add', rustAdd, ADD_ITERATIONS);
console.log(`### Results
- JavaScript: ${jsAddTime.toFixed(2)}ms
- Rust: ${rustAddTime.toFixed(2)}ms
- Speedup: ${(jsAddTime / rustAddTime).toFixed(2)}x\n`);

// Fibonacci benchmarks
console.log('## Fibonacci Benchmark');
const FIB_ITERATIONS = 100;
const FIB_N = 30;
console.log(`Running ${FIB_ITERATIONS.toLocaleString()} iterations of fib(${FIB_N})...\n`);

// Warm up
benchmarkUnary('Warmup JS Fibonacci', jsFib, FIB_N, 1);
benchmarkUnary('Warmup Rust Fibonacci', rustFib, FIB_N, 1);

// Fibonacci benchmarks
const jsFibTime = benchmarkUnary('JavaScript Fibonacci', jsFib, FIB_N, FIB_ITERATIONS);
const rustFibTime = benchmarkUnary('Rust Fibonacci', rustFib, FIB_N, FIB_ITERATIONS);
console.log(`### Results
- JavaScript: ${jsFibTime.toFixed(2)}ms
- Rust: ${rustFibTime.toFixed(2)}ms
- Speedup: ${(jsFibTime / rustFibTime).toFixed(2)}x\n`);

// Matrix multiplication benchmarks
console.log('## Matrix Multiplication Benchmark');
const MATRIX_SIZE = 200;
const MATRIX_ITERATIONS = 5;
console.log(`Running ${MATRIX_ITERATIONS} iterations of ${MATRIX_SIZE}x${MATRIX_SIZE} matrix multiplication...\n`);

// Warm up
benchmarkUnary('Warmup JS Matrix', jsMatrixMultiply, MATRIX_SIZE, 1);
benchmarkUnary('Warmup Rust Matrix', rustMatrix, MATRIX_SIZE, 1);

// Matrix multiplication benchmarks
const jsMatrixTime = benchmarkUnary('JavaScript Matrix', jsMatrixMultiply, MATRIX_SIZE, MATRIX_ITERATIONS);
const rustMatrixTime = benchmarkUnary('Rust Matrix', rustMatrix, MATRIX_SIZE, MATRIX_ITERATIONS);
console.log(`### Results
- JavaScript: ${jsMatrixTime.toFixed(2)}ms
- Rust: ${rustMatrixTime.toFixed(2)}ms
- Speedup: ${(jsMatrixTime / rustMatrixTime).toFixed(2)}x\n`); 