package org.solovyev.android.calculator.entities;

import org.solovyev.common.math.MathEntity;

import javax.annotation.Nonnull;

public interface Category<E extends MathEntity> {

    int ordinal();

    @Nonnull
    String name();

    boolean isInCategory(@Nonnull E entity);

    int title();
}
