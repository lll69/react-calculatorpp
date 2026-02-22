package lll69;

// https://github.com/konsoletyper/teavm/issues/1154
public class ParseDoubleTest {
    private static void tryParseDouble(String str) {
        try {
            double doubleValue = Double.parseDouble(str);
            System.out.println("parseDouble " + str + " Success: " + doubleValue);
        } catch (NumberFormatException e) {
            System.out.println("parseDouble " + str + " Error: " + e.getClass().getName());
        }
    }

    private static void tryParseFloat(String str) {
        try {
            float floatValue = Float.parseFloat(str);
            System.out.println("parseFloat " + str + " Success: " + floatValue);
        } catch (NumberFormatException e) {
            System.out.println("parseFloat " + str + " Error: " + e.getClass().getName());
        }
    }

    private static void tryParse(String str) {
        tryParseDouble(str);
        tryParseFloat(str);
    }

    public static void main(String[] args) {
        System.out.println("--- Constants ---");
        System.out.println(Double.POSITIVE_INFINITY + " " + Float.POSITIVE_INFINITY);
        System.out.println(Double.NEGATIVE_INFINITY + " " + Float.NEGATIVE_INFINITY);
        System.out.println(Double.NaN + " " + Float.NaN);
        System.out.println();
        System.out.println("--- Parse Numbers ---");
        tryParse("Infinity");
        tryParse("+Infinity");
        tryParse("-Infinity");
        tryParse("NaN");
        tryParse("+NaN");
        tryParse("-NaN");
        System.out.println();
        System.out.println("--- Invalid Numbers ---");
        tryParse("INFINITY");
        tryParse("infinity");
        tryParse("++Infinity");
        tryParse("--Infinity");
        tryParse("NAN");
        tryParse("nan");
        tryParse("++NaN");
        tryParse("--NaN");
    }
}
