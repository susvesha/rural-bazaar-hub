import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Target, Users, Sparkles } from "lucide-react";
import aboutArtisan from "@/assets/about-artisan.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe in empowering rural entrepreneurs to reach global markets while preserving their traditional crafts.",
    },
    {
      icon: Target,
      title: "Authenticity",
      description: "Every product on our platform represents genuine craftsmanship and the rich cultural heritage of rural India.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster a supportive community that connects artisans, farmers, and buyers in meaningful ways.",
    },
    {
      icon: Sparkles,
      title: "Quality",
      description: "We ensure that every product meets high standards of quality while maintaining fair pricing for creators.",
    },
  ];

  const stats = [
    { value: "1000+", label: "Rural Entrepreneurs" },
    { value: "5000+", label: "Products Listed" },
    { value: "50+", label: "Villages Reached" },
    { value: "₹10L+", label: "Revenue Generated" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering Rural India,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                One Product at a Time
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              LocalBazaar is more than just a marketplace. We're a movement dedicated to bridging
              the gap between rural craftsmanship and modern commerce, creating opportunities for
              sustainable growth and cultural preservation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={aboutArtisan}
                  alt="Rural Artisan"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-block glass px-4 py-2 rounded-full text-sm font-medium">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold">
                Building Bridges Between Tradition and Technology
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We started LocalBazaar with a simple vision: to create a platform where rural
                artisans, farmers, and entrepreneurs could showcase their authentic products to a
                global audience without losing their identity or fair compensation.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every transaction on our platform directly impacts the lives of rural families,
                preserving traditional crafts while providing sustainable livelihoods.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-8 text-center hover-lift"
              >
                <div className="gradient-primary w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Us in Making a Difference
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're an artisan looking to sell your products or a buyer seeking authentic
              handmade goods, you're part of something bigger.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
