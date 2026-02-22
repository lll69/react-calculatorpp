package lll69.cpp;

import jscl.AngleUnit;
import jscl.JsclMathEngine;
import jscl.NumeralBase;
import jscl.math.function.CustomFunction;
import jscl.math.function.FunctionsRegistry;
import jscl.text.ParseException;
import org.solovyev.android.calculator.ToJsclTextProcessor;
import org.solovyev.common.msg.Message;
import org.teavm.jso.JSExceptions;
import org.teavm.jso.JSExport;
import org.teavm.jso.JSExportClasses;
import org.teavm.jso.JSObject;
import org.teavm.jso.core.JSArray;
import org.teavm.jso.core.JSString;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@JSExportClasses({ParseException.class})
public class Client {
    private static JsclMathEngine engine;

    @JSExport
    public static void initJscl() throws ParseException {
        JsclMathEngine engine = JsclMathEngine.getInstance();
        FunctionsRegistry functions = FunctionsRegistry.getInstance();
        functions.addOrUpdate(new CustomFunction.Builder(true, "log", Arrays.asList("base", "x"),
                "ln(x)/ln(base)").create());
        functions.addOrUpdate(new CustomFunction.Builder(true, "√3", Collections.singletonList("x"),
                "x^(1/3)").create());
        functions.addOrUpdate(new CustomFunction.Builder(true, "√4", Collections.singletonList("x"),
                "x^(1/4)").create());
        functions.addOrUpdate(new CustomFunction.Builder(true, "√n", Arrays.asList("x", "n"), "x^(1/n)").create());
        functions.addOrUpdate(new CustomFunction.Builder(true, "re", Collections.singletonList("x"),
                "(x+conjugate(x))/2").create());
        functions.addOrUpdate(new CustomFunction.Builder(true, "im", Collections.singletonList("x"),
                "(x-conjugate(x))/(2*i)").create());
        engine.evaluate("1");
        Client.engine = engine;
    }

    @JSExport
    public static JsclMathEngine getMathEngine() {
        return engine;
    }

    @JSExport
    public static boolean isParseException(JSObject obj) {
        Throwable th = JSExceptions.getJavaException(obj);
        return th instanceof ParseException || th instanceof org.solovyev.android.calculator.ParseException;
    }

    @JSExport
    public static String getErrorMessage(JSObject obj) {
        Throwable th = JSExceptions.getJavaException(obj);
        try {
            return th.toString();
        } catch (Throwable ignored) {
            return th.getClass().getName();
        }
    }

    @JSExport
    public static int pePosition(JSObject obj) {
        Throwable th = JSExceptions.getJavaException(obj);
        if (th instanceof ParseException) {
            return ((ParseException) th).getPosition();
        }
        if (th instanceof org.solovyev.android.calculator.ParseException) {
            Integer position = ((org.solovyev.android.calculator.ParseException) th).getPosition();
            return position == null ? 0 : position;
        }
        throw new ClassCastException();
    }

    @JSExport
    public static String peExpression(JSObject obj) {
        Throwable th = JSExceptions.getJavaException(obj);
        if (th instanceof ParseException) {
            return ((ParseException) th).getExpression();
        }
        if (th instanceof org.solovyev.android.calculator.ParseException) {
            return ((org.solovyev.android.calculator.ParseException) th).getExpression();
        }
        throw new ClassCastException();
    }

    @JSExport
    public static String peMessageCode(JSObject obj) {
        Throwable th = JSExceptions.getJavaException(obj);
        if (th instanceof ParseException) {
            return ((ParseException) th).getMessageCode();
        }
        if (th instanceof org.solovyev.android.calculator.ParseException) {
            return "osac_" + ((org.solovyev.android.calculator.ParseException) th).getMessageCode();
        }
        throw new ClassCastException();
    }

    @JSExport
    public static JSArray<JSObject> peParams(JSObject obj) {
        Throwable th = JSExceptions.getJavaException(obj);
        if (!(th instanceof Message)) {
            throw new ClassCastException();
        }
        List<Object> list = ((Message) JSExceptions.getJavaException(obj)).getParameters();
        JSArray<JSObject> result = new JSArray<>(list.size());
        for (int i = 0, len = list.size(); i < len; i++) {
            Object object = list.get(i);
            result.set(i, JSString.valueOf(String.valueOf(object)));
        }
        return result;
    }

    @JSExport
    public static String evaluate(JsclMathEngine engine, String expr) throws ParseException {
        return engine.evaluate(expr);
    }

    @JSExport
    public static String simplify(JsclMathEngine engine, String expr) throws ParseException {
        return engine.simplify(expr);
    }

    @JSExport
    public static String elementary(JsclMathEngine engine, String expr) throws ParseException {
        return engine.elementary(expr);
    }

    @JSExport
    public static String processExpr(JsclMathEngine engine, String expr) {
        ToJsclTextProcessor processor = ToJsclTextProcessor.getInstance();
        processor.setEngine(engine);
        return processor.process(expr).value;
    }

    @JSExport
    public static void setAngleUnits(JsclMathEngine engine, String unit) {
        engine.setAngleUnits(AngleUnit.valueOf(unit));
    }

    @JSExport
    public static void setNumeralBase(JsclMathEngine engine, String base) {
        engine.setNumeralBase(NumeralBase.valueOf(base));
    }
}
