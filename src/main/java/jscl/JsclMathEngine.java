package jscl;

import static midpcalc.Real.NumberFormat.FSE_ENG;
import static midpcalc.Real.NumberFormat.FSE_NONE;
import static midpcalc.Real.NumberFormat.FSE_SCI;

import org.solovyev.common.NumberFormatter;
import org.solovyev.common.math.MathRegistry;
import org.solovyev.common.msg.MessageRegistry;
import org.solovyev.common.msg.Messages;

import java.math.BigInteger;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import jscl.math.Expression;
import jscl.math.Generic;
import jscl.math.function.Constants;
import jscl.math.function.ConstantsRegistry;
import jscl.math.function.Function;
import jscl.math.function.FunctionsRegistry;
import jscl.math.function.IConstant;
import jscl.math.function.PostfixFunctionsRegistry;
import jscl.math.operator.Operator;
import jscl.math.operator.Percent;
import jscl.math.operator.Rand;
import jscl.math.operator.matrix.OperatorsRegistry;
import jscl.text.ParseException;
import org.teavm.jso.JSExport;

public class JsclMathEngine extends org.solovyev.android.calculator.Engine implements MathEngine {

    public static final AngleUnit DEFAULT_ANGLE_UNITS = AngleUnit.deg;
    public static final NumeralBase DEFAULT_NUMERAL_BASE = NumeralBase.dec;
    public static final char GROUPING_SEPARATOR_DEFAULT = ' ';
    @Nonnull
    private static JsclMathEngine instance = new JsclMathEngine();
    @Nonnull
    private final ThreadLocal<NumberFormatter> numberFormatter = new ThreadLocal<NumberFormatter>() {
        @Override
        protected NumberFormatter initialValue() {
            return new NumberFormatter();
        }
    };
    private char groupingSeparator = NumberFormatter.NO_GROUPING;
    private int notation = FSE_NONE;
    private int precision = NumberFormatter.MAX_PRECISION;
    @Nonnull
    private AngleUnit angleUnits = DEFAULT_ANGLE_UNITS;
    @Nonnull
    private NumeralBase numeralBase = DEFAULT_NUMERAL_BASE;
    @Nonnull
    private MessageRegistry messageRegistry = Messages.synchronizedMessageRegistry(new FixedCapacityListMessageRegistry(10));

    public JsclMathEngine() {
    }

    @Nonnull
    public static JsclMathEngine getInstance() {
        return instance;
    }

    @Nonnull
    @JSExport
    public String evaluate(@Nonnull String expression) throws ParseException {
        return evaluateGeneric(expression).toString();
    }

    @Nonnull
    @JSExport
    public String simplify(@Nonnull String expression) throws ParseException {
        return simplifyGeneric(expression).toString();
    }

    @Nonnull
    @JSExport
    public String elementary(@Nonnull String expression) throws ParseException {
        return elementaryGeneric(expression).toString();
    }

    @Nonnull
    @JSExport
    public Generic evaluateGeneric(@Nonnull String expression) throws ParseException {
        if (expression.contains(Percent.NAME) || expression.contains(Rand.NAME)) {
            return Expression.valueOf(expression).numeric();
        } else {
            return Expression.valueOf(expression).expand().numeric();
        }
    }

    @Nonnull
    @JSExport
    public Generic simplifyGeneric(@Nonnull String expression) throws ParseException {
        if (expression.contains(Percent.NAME) || expression.contains(Rand.NAME)) {
            return Expression.valueOf(expression);
        } else {
            return Expression.valueOf(expression).expand().simplify();
        }
    }

    @Nonnull
    @JSExport
    public Generic elementaryGeneric(@Nonnull String expression) throws ParseException {
        return Expression.valueOf(expression).elementary();
    }

    @Nonnull
    @JSExport
    public MathRegistry<Function> getFunctionsRegistry() {
        return FunctionsRegistry.lazyInstance();
    }

    @Nonnull
    @JSExport
    public MathRegistry<Operator> getOperatorsRegistry() {
        return OperatorsRegistry.lazyInstance();
    }

    @Nonnull
    @JSExport
    public MathRegistry<Operator> getPostfixFunctionsRegistry() {
        return PostfixFunctionsRegistry.lazyInstance();
    }

    @Nonnull
    @JSExport
    public AngleUnit getAngleUnits() {
        return angleUnits;
    }

    @JSExport
    public void setAngleUnits(@Nonnull AngleUnit angleUnits) {
        this.angleUnits = angleUnits;
    }

    @Nonnull
    @JSExport
    public NumeralBase getNumeralBase() {
        return numeralBase;
    }

    @JSExport
    public void setNumeralBase(@Nonnull NumeralBase numeralBase) {
        this.numeralBase = numeralBase;
    }

    @Nonnull
    @JSExport
    public MathRegistry<IConstant> getConstantsRegistry() {
        return ConstantsRegistry.lazyInstance();
    }

    @Nonnull
    public String format(double value) {
        return format(value, numeralBase);
    }

    @Nonnull
    public String format(double value, @Nonnull NumeralBase nb) {
        if (Double.isInfinite(value)) {
            return formatInfinity(value);
        }
        if (Double.isNaN(value)) {
            // return "NaN"
            return String.valueOf(value);
        }
        if (nb == NumeralBase.dec) {
            if (value == 0d) {
                return "0";
            }
            // detect if current number is precisely equals to constant in constants' registry  (NOTE: ONLY FOR SYSTEM CONSTANTS)
            final IConstant constant = findConstant(value);
            if (constant != null) {
                return constant.getName();
            }
        }
        return prepareNumberFormatter(nb).format(value, nb.radix).toString();
    }

    private NumberFormatter prepareNumberFormatter(@Nonnull NumeralBase nb) {
        final NumberFormatter nf = numberFormatter.get();
        nf.setGroupingSeparator(hasGroupingSeparator() ? getGroupingSeparator(nb) : NumberFormatter.NO_GROUPING);
        nf.setPrecision(precision);
        switch (notation) {
            case FSE_ENG:
                nf.useEngineeringFormat(NumberFormatter.DEFAULT_MAGNITUDE);
                break;
            case FSE_SCI:
                nf.useScientificFormat(NumberFormatter.DEFAULT_MAGNITUDE);
                break;
            default:
                nf.useSimpleFormat();
                break;
        }
        return nf;
    }

    @Override
    public String format(@Nonnull BigInteger value) {
        return format(value, numeralBase);
    }

    @Nonnull
    public String format(@Nonnull BigInteger value, @Nonnull NumeralBase nb) {
        if (nb == NumeralBase.dec) {
            if (BigInteger.ZERO.equals(value)) {
                return "0";
            }
        }
        return prepareNumberFormatter(nb).format(value, nb.radix).toString();
    }

    @Nullable
    private IConstant findConstant(double value) {
        final MathRegistry<IConstant> constants = ConstantsRegistry.getInstance();
        final IConstant constant = findConstant(constants.getSystemEntities(), value);
        if (constant != null) {
            return constant;
        }
        final IConstant piInv = constants.get(Constants.PI_INV.getName());
        if (piInv != null) {
            final Double piInvValue = piInv.getDoubleValue();
            if (piInvValue != null && piInvValue == value) {
                return piInv;
            }
        }
        return null;
    }

    private String formatInfinity(@Nonnull Double value) {
        // return predefined constant for infinity
        if (value >= 0) {
            return Constants.INF.getName();
        } else {
            return Constants.INF.expressionValue().negate().toString();
        }
    }

    @Nullable
    private IConstant findConstant(@Nonnull List<IConstant> constants, @Nonnull Double value) {
        for (int i = 0; i < constants.size(); i++) {
            final IConstant constant = constants.get(i);
            if (!value.equals(constant.getDoubleValue())) {
                continue;
            }
            final String name = constant.getName();
            if (name.equals(Constants.PI_INV.getName()) || name.equals(Constants.ANS)) {
                continue;
            }
            if (!name.equals(Constants.PI.getName()) || getAngleUnits() == AngleUnit.rad) {
                return constant;
            }
        }
        return null;
    }

    @Nonnull
    @JSExport
    public MessageRegistry getMessageRegistry() {
        return messageRegistry;
    }

    @JSExport
    public void setMessageRegistry(@Nonnull MessageRegistry messageRegistry) {
        this.messageRegistry = messageRegistry;
    }

    @Nonnull
    @Override
    public String format(@Nonnull String value, @Nonnull NumeralBase nb) {
        if (!hasGroupingSeparator()) {
            return value;
        }
        final int dot = value.indexOf('.');
        if (dot >= 0) {
            final String intPart = dot != 0 ? insertSeparators(value.substring(0, dot), nb) : "";
            return intPart + value.substring(dot);
        }
        final int e = nb == NumeralBase.hex ? -1 : value.indexOf('E');
        if (e >= 0) {
            final String intPart = e != 0 ? insertSeparators(value.substring(0, e), nb) : "";
            return intPart + value.substring(e);
        }
        return insertSeparators(value, nb);
    }

    @Nonnull
    @JSExport
    public String insertSeparators(@Nonnull String value, @Nonnull NumeralBase nb) {
        final char separator = getGroupingSeparator(nb);
        final StringBuilder result = new StringBuilder(value.length() + nb.getGroupingSize());
        for (int i = value.length() - 1; i >= 0; i--) {
            result.append(value.charAt(i));
            if (i != 0 && (value.length() - i) % nb.getGroupingSize() == 0) {
                result.append(separator);
            }
        }
        return result.reverse().toString();
    }

    private boolean hasGroupingSeparator() {
        return groupingSeparator != NumberFormatter.NO_GROUPING;
    }

    private char getGroupingSeparator(@Nonnull NumeralBase nb) {
        return nb == NumeralBase.dec ? groupingSeparator : ' ';
    }

    @JSExport
    public void setPrecision(int precision) {
        this.precision = precision;
    }

    @JSExport
    public void setNotation(int notation) {
        if (notation != FSE_SCI && notation != FSE_ENG && notation != FSE_NONE) {
            throw new IllegalArgumentException("Unsupported notation: " + notation);
        }
        this.notation = notation;
    }

    @JSExport
    public char getGroupingSeparator() {
        return this.groupingSeparator;
    }

    @JSExport
    public void setGroupingSeparator(char separator) {
        this.groupingSeparator = separator;
    }
}
