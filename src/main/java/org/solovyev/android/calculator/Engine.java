package org.solovyev.android.calculator;

import jscl.JsclMathEngine;
import jscl.MathEngine;

import javax.annotation.Nonnull;

public abstract class Engine implements MathEngine {
    VariablesRegistry variablesRegistry;

    public Engine() {
        variablesRegistry = new VariablesRegistry((JsclMathEngine) this);
        this.setPrecision(5);
        this.setGroupingSeparator(JsclMathEngine.GROUPING_SEPARATOR_DEFAULT);
    }

    @Nonnull
    public VariablesRegistry getVariablesRegistry() {
        return variablesRegistry;
    }
}
