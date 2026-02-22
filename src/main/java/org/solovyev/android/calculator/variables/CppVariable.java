package org.solovyev.android.calculator.variables;

import jscl.math.function.IConstant;
import lll69.cpp.TextUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.solovyev.android.Check;
import org.solovyev.android.calculator.json.Json;
import org.solovyev.android.calculator.json.Jsonable;

import javax.annotation.Nonnull;

import static com.google.common.base.Strings.nullToEmpty;

public class CppVariable implements Jsonable {

    public static final Json.Creator<CppVariable> JSON_CREATOR = new Json.Creator<CppVariable>() {
        @Nonnull
        @Override
        public CppVariable create(@Nonnull JSONObject json) throws JSONException {
            return new CppVariable(json);
        }
    };
    /*
    public static final Creator<CppVariable> CREATOR = new Creator<CppVariable>() {
        @Override
        public CppVariable createFromParcel(Parcel in) {
            return new CppVariable(in);
        }

        @Override
        public CppVariable[] newArray(int size) {
            return new CppVariable[size];
        }
    };*/
    public static final int NO_ID = -1;
    private static final String JSON_NAME = "n";
    private static final String JSON_VALUE = "v";
    private static final String JSON_DESCRIPTION = "d";
    protected int id = NO_ID;
    @Nonnull
    protected String name;
    @Nonnull
    protected String value = "";
    @Nonnull
    protected String description = "";
    protected boolean system;

    private CppVariable(@Nonnull String name) {
        this.name = name;
    }

    protected CppVariable(@Nonnull CppVariable that) {
        this.id = that.id;
        this.name = that.name;
        this.value = that.value;
        this.description = that.description;
        this.system = that.system;
    }

    protected CppVariable(@Nonnull IConstant that) {
        id = that.isIdDefined() ? that.getId() : NO_ID;
        name = that.getName();
        value = nullToEmpty(that.getValue());
        description = nullToEmpty(that.getDescription());
        system = that.isSystem();
    }

    private CppVariable(@Nonnull JSONObject json) throws JSONException {
        this.name = json.getString(JSON_NAME);
        this.value = json.optString(JSON_VALUE);
        this.description = json.optString(JSON_DESCRIPTION);
    }

    /*
    protected CppVariable(Parcel in) {
        id = in.readInt();
        name = in.readString();
        value = in.readString();
        description = in.readString();
        system = in.readByte() != 0;
    }*/

    @Nonnull
    public static CppVariable.Builder builder(@Nonnull String name) {
        return new Builder(name);
    }

    @Nonnull
    public static CppVariable.Builder builder(@Nonnull String name, double value) {
        return new Builder(name).withValue(value);
    }

    @Nonnull
    public static Builder builder(@Nonnull IConstant constant) {
        return new Builder(constant);
    }

    @Nonnull
    @Override
    public JSONObject toJson() throws JSONException {
        final JSONObject json = new JSONObject();
        json.put(JSON_NAME, name);
        if (!TextUtils.isEmpty(value)) {
            json.put(JSON_VALUE, value);
        }
        if (!TextUtils.isEmpty(description)) {
            json.put(JSON_DESCRIPTION, description);
        }
        return json;
    }

    @Nonnull
    public IConstant toJsclConstant() {
        return new JsclConstant(CppVariable.this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CppVariable)) return false;

        CppVariable that = (CppVariable) o;

        if (id != that.id) return false;
        return name.equals(that.name);

    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + name.hashCode();
        return result;
    }

    /*
    @Override
    public int describeContents() {
        return 0;
    }*/

    /*
    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(id);
        dest.writeString(name);
        dest.writeString(value);
        dest.writeString(description);
        dest.writeByte((byte) (system ? 1 : 0));
    }*/

    @Override
    public String toString() {
        if (id == NO_ID) {
            return name + "=" + value;
        } else {
            return name + "[#" + id + "]=" + value;
        }
    }

    public static class Builder {
        @Nonnull
        private final CppVariable variable;
        private boolean built;

        private Builder(@Nonnull String name) {
            variable = new CppVariable(name);
        }

        private Builder(@Nonnull IConstant constant) {
            variable = new CppVariable(constant);
        }

        @Nonnull
        public Builder withDescription(@Nonnull String description) {
            Check.isTrue(!built);
            variable.description = description;
            return this;
        }

        @Nonnull
        public Builder withValue(@Nonnull String value) {
            Check.isTrue(!built);
            variable.value = value;
            return this;
        }

        @Nonnull
        public Builder withValue(double value) {
            Check.isTrue(!built);
            return withValue(Double.toString(value));
        }

        @Nonnull
        public Builder withSystem(boolean system) {
            Check.isTrue(!built);
            variable.system = system;
            return this;
        }

        @Nonnull
        public Builder withId(int id) {
            Check.isTrue(!built);
            variable.id = id;
            return this;
        }

        @Nonnull
        public CppVariable build() {
            built = true;
            return variable;
        }
    }
}
