package lll69.cpp;

// https://github.com/konsoletyper/teavm/issues/1154
public class CDouble {
    public static Double valueOf(String s) {
        return Double.valueOf(parseDouble(s));
    }

    public static double parseDouble(String s) throws NumberFormatException {
        switch (s) {
            case "Infinity":
            case "+Infinity":
                return Double.POSITIVE_INFINITY;
            case "-Infinity":
                return Double.NEGATIVE_INFINITY;
            case "NaN":
            case "+NaN":
            case "-NaN":
                return Double.NaN;
        }
        return Double.parseDouble(s);
    }
}
