BEGIN {
    for (i = 0; i < 10; i++) {
        ar[i] = 0;
    }
}
END {
    for (i = 0; i < 10; i++) {
        printf("ar[%d] = %d\n", i, ar[i]);
    }
}
{
    a = int($1 * 10);
    ar[a]++;
}
