#[cfg(test)]
mod tests {
    #[test]
    fn normal_test() {
        assert_eq!(1, 1);
    }

    #[test]
    #[ignore]
    fn ignored_test() {
        assert_eq!(1, 2);
    }

    #[test]
    #[ignore = "This test is ignored for a reason"]
    fn ignored_test_with_reason() {
        assert_eq!(1, 2);
    }
}
