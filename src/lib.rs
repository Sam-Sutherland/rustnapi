use napi_derive::napi;

#[napi]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[napi]
pub fn fibonacci(n: i32) -> i64 {
    if n <= 1 {
        return n as i64;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

#[napi]
pub fn matrix_multiply(size: i32) -> i64 {
    let n = size as usize;
    let a = vec![vec![1.0; n]; n];
    let b = vec![vec![2.0; n]; n];
    let mut c = vec![vec![0.0; n]; n];

    // Matrix multiplication
    for i in 0..n {
        for j in 0..n {
            for k in 0..n {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    // Sum all elements (to prevent compiler optimization)
    c.iter().flat_map(|row| row.iter()).sum::<f64>() as i64
}