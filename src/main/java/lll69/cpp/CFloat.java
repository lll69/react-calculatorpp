package lll69.cpp;

// https://github.com/konsoletyper/teavm/issues/1154
public class CFloat {
    public static Float valueOf(String s) {
        return Float.valueOf(parseFloat(s));
    }

    public static float parseFloat(String s) throws NumberFormatException {
        switch (s) {
            case "Infinity":
            case "+Infinity":
                return Float.POSITIVE_INFINITY;
            case "-Infinity":
                return Float.NEGATIVE_INFINITY;
            case "NaN":
            case "+NaN":
            case "-NaN":
                return Float.NaN;
        }
        return Float.parseFloat(s);
    }
}
