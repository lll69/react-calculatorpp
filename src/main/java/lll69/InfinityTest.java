package lll69;

// https://github.com/konsoletyper/teavm/issues/1156
// isInfinite(Double.NaN) in TeaVM returns true
public class InfinityTest {
    public static void main(String[] args) {
        System.out.println("Is NaN Finite: " + Double.isFinite(Double.NaN));
        System.out.println("Is NaN Infinite: " + Double.isInfinite(Double.NaN));
    }
}
